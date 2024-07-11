const Media = require('../models/MediaSchema')
const fs = require('fs/promises'); // Using promises-based fs module
const path = require('path');
const {validExtensions} = require('../middlewares/uploadFiles')


const addMedia = async (req, res) => {
    try {
        const uploadedFiles = req.files;
        
        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

        const { name, description, media_names } = req.body;
        let files = [];

        // Process each uploaded file
        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            const fileExtension = file.originalname.split('.').pop().toLowerCase();
            let fileType = null;

            // Determine the file type based on valid extensions
            for (const [type, extensions] of Object.entries(validExtensions)) {
                if (extensions.includes(fileExtension)) {
                    fileType = type;
                    break;
                }
            }

            if (!fileType) {
                // Delete the uploaded file if it does not match valid extensions
                await fs.unlink(file.path);
                return res.status(400).json({ error: `Invalid file type for ${file.originalname}` });
            }

            // Create file format object for MongoDB storage
            const fileFormat = {
                media_name: media_names[i], // Assuming media_names array corresponds to each file
                href: `/assets/${fileType}/${file.filename}`, // Assuming 'filename' is stored by multer
                type: fileType
            };

            files.push(fileFormat);
        }

        // Create a new Media document
        const media = new Media({ name, description, data: files });
        await media.save();

        res.status(201).json({ message: "Media added successfully" });
    } catch (err) {
        console.error("Error adding media:", err);

        // Delete uploaded files if an error occurs during database operation
        if (uploadedFiles && uploadedFiles.length > 0) {
            uploadedFiles.forEach(async (file) => {
                try {
                    await fs.unlink(file.path);
                    console.log(`Deleted file: ${file.path}`);
                } catch (unlinkErr) {
                    console.error(`Failed to delete file: ${file.path}`, unlinkErr);
                }
            });
        }

        res.status(500).json({ error: 'Oops, something went wrong' });
    }
};


const deleteMedia = async (req, res) => {
    try {
        const { _id, href } = req.body;

        // Find the document by path
        const mediaDoc = await Media.findById(_id);

        if (!mediaDoc) {
            return res.status(404).json({ error: "Path not exists" });
        }

        // Find the file to be removed
        const fileToRemove = mediaDoc.data.find(file => file.href === href);

        if (!fileToRemove) {
            return res.status(404).json({ error: "Media not found" });
        }

        // Delete the file from the server
        const serverMediaPath = path.join(__dirname, '../..', 'public', 'assets', fileToRemove.type, path.basename(fileToRemove.href));
        await fs.unlink(serverMediaPath);

        // Remove the file from the data array in MongoDB
        mediaDoc.data = mediaDoc.data.filter(file => file.href !== href);

        // Save the updated document
        await mediaDoc.save();

        res.status(200).json({ message: 'Media deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};


const ViewMedia = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query with optional date range filter
        const query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Find and sort the media items by the 'createdAt' field, and apply pagination
        const data = await Media.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        // Count total number of documents matching the query
        const total = await Media.countDocuments(query);

        // Calculate pagination details
        const totalPages = Math.ceil(total / limit);
        const nextPage = page < totalPages ? page + 1 : null;
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        res.status(200).json({
            data,
            pagination: {
                total,
                totalPages,
                nextPage,
                hasNextPage,
                hasPreviousPage,
                limit
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Oops, something went wrong" });
    }
};


module.exports = {addMedia, deleteMedia, ViewMedia}