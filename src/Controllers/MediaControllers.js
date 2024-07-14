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

        const { name, description, eventDate } = req.body;
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
                media_name: file.filename, // Assuming media_names array corresponds to each file
                href: `/assets/${fileType}/${file.filename}`, // Assuming 'filename' is stored by multer
                type: fileType
            };

            files.push(fileFormat);
        }

        // Create a new Media document
        const media = new Media({ name, description, eventDate, data: files });
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

const UploadMoreMedia = async (req, res) => {
    try {
        const uploadedFiles = req.files;
        
        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

        const { _id, name, description } = req.body;
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
                media_name: file.filename, // Assuming media_names array corresponds to each file
                href: `/assets/${fileType}/${file.filename}`, // Assuming 'filename' is stored by multer
                type: fileType
            };

            files.push(fileFormat);
        }

        // Create update object conditionally
        let updateObject = { $push: { data: { $each: files } } };
        if (name) updateObject.name = name;
        if (description) updateObject.description = description;

        // Update the Media document
        const media = await Media.findByIdAndUpdate(
            _id,
            updateObject,
            { new: true }
        );

        if (!media) {
            return res.status(404).json({ error: "Media document not found" });
        }

        res.status(201).json({ message: "Media added successfully", media });
    } catch (err) {
        console.error("Error adding media:", err);

        // Delete uploaded files if an error occurs during database operation
        if (uploadedFiles && uploadedFiles.length > 0) {
            for (const file of uploadedFiles) {
                try {
                    await fs.unlink(file.path);
                    console.log(`Deleted file: ${file.path}`);
                } catch (unlinkErr) {
                    console.error(`Failed to delete file: ${file.path}`, unlinkErr);
                }
            }
        }

        res.status(500).json({ error: 'Oops, something went wrong' });
    }
};


const deleteMedia = async (req, res) => {
    try {
        const {_id, href } = req.body;

        console.log(_id, href)

        // Find the document by path
        const mediaDoc = await Media.findById(_id);

        if (!mediaDoc) {
            return res.status(404).json({ error: "id not exists" });
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

const deleteEventMedia = async (req, res) => {
    try {
        const { _id } = req.body;

        // Find the document by ID
        const mediaDoc = await Media.findById(_id);

        if (!mediaDoc) {
            return res.status(404).json({ error: "Media document not found" });
        }

        // Delete all files from the server
        for (const file of mediaDoc.data) {
            const serverMediaPath = path.join(__dirname, '../..', 'public', 'assets', file.type, path.basename(file.href));
            try {
                await fs.unlink(serverMediaPath);
                console.log(`Deleted file: ${serverMediaPath}`);
            } catch (unlinkErr) {
                console.error(`Failed to delete file: ${serverMediaPath}`, unlinkErr);
            }
        }

        // Delete the document from the database
        await Media.findByIdAndDelete(_id);

        res.status(200).json({ message: 'Media and associated files deleted successfully' });
    } catch (err) {
        console.error("Error deleting media:", err);
        res.status(500).json({ error: 'Oops, something went wrong' });
    }
}; 
    
const ViewSingleMedia = async (req, res) => {
    try {
        const { id } = req.params; // Assuming id is in params, not _id

        const data = await Media.findById(id);

        if (!data) {
            return res.status(404).json({ error: 'Media not found' });
        }

        return res.status(200).json({ data });
        
    } catch (error) {
        console.error("Error fetching Media:", error);
        res.status(500).json({ error: 'Oops, something went wrong' });
    }
}

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


module.exports = {addMedia, deleteMedia, UploadMoreMedia, deleteEventMedia, ViewSingleMedia, ViewMedia}