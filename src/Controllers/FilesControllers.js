const File = require('../models/FileSchema')
const fs = require('fs/promises'); // Using promises-based fs module
const path = require('path');


const addFiles = async (req, res) => {

        const uploadedFiles = req.files;
        
        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

        const { filePath, data } = req.body;

        try {
            // Find the existing document by path
            const pathExist = await File.findOne({ path: filePath });

            if (!pathExist) {
                // Delete the uploaded files if path does not exist
                await Promise.all(uploadedFiles.map(async file => {
                    try {
                        await fs.unlink(file.path);
                    } catch (unlinkErr) {
                        console.error(`Failed to delete file: ${file.path}`, unlinkErr);
                    }
                }));
                return res.status(404).json({ error: "Path not exists" });
            }

            // Append the new data to the existing data array
            pathExist.data.push(...data);

            // Save the updated document
            await pathExist.save();

            res.status(201).json({ message: 'Success!!' });
        } catch (err) {
            console.log(err);
            // Delete the uploaded files in case of an error
            await Promise.all(uploadedFiles.map(async file => {
                try {
                    await fs.unlink(file.path);
                } catch (unlinkErr) {
                    console.error(`Failed to delete file: ${file.path}`, unlinkErr);
                }
            }));
            res.status(500).json({ error: 'Oops some thing went wrong' });
        }
};


const deleteFile = async (req, res) => {
    try {
        const { filePath, href } = req.body;

        // Find the document by path
        const fileDoc = await File.findOne({ path:filePath });

        if (!fileDoc) {
            return res.status(404).json({ error: "Path not exists" });
        }

        // Find the file to be removed
        const fileToRemove = fileDoc.data.find(file => file.href === href);

        if (!fileToRemove) {
            return res.status(404).json({ error: "File not found" });
        }

        // Delete the file from the server
        const serverFilePath = path.join(__dirname, '../..', 'public', 'assets', fileToRemove.type, path.basename(fileToRemove.href));
        await fs.unlink(serverFilePath);

        // Remove the file from the data array in MongoDB
        fileDoc.data = fileDoc.data.filter(file => file.href !== href);

        // Save the updated document
        await fileDoc.save();

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};


const ViewFiles = async (req, res) => {
    try {
        const { path, name, startDate, endDate } = req.query; // Assuming path, name, startDate, endDate are passed as query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Define filters based on query parameters
        const filters = { path };
        
        // Add filter by name if provided
        if (name) {
            filters['data.name'] = { $regex: new RegExp(name, 'i') }; // Case-insensitive search
        }

        // Add date range filter if startDate and/or endDate are provided
        if (startDate || endDate) {
            filters['data.createdAt'] = {};
            if (startDate) {
                filters['data.createdAt'].$gte = new Date(startDate);
            }
            if (endDate) {
                filters['data.createdAt'].$lte = new Date(endDate);
            }
        }

        // Find and sort the files by the 'createdAt' field in fileDataSchema, and apply pagination
        const data = await File.aggregate([
            { $match: filters },
            { $unwind: '$data' },
            { $match: filters },
            { $sort: { 'data.createdAt': -1 } }, // Sort by createdAt in descending order
            { $skip: skip },
            { $limit: limit },
            {
                $group: {
                    _id: null,
                    data: { $push: '$data' }
                }
            }
        ]);

        // Count total number of documents matching the filters
        const total = await File.aggregate([
            { $match: filters },
            { $unwind: '$data' },
            { $match: filters },
            { $count: 'total' }
        ]);

        // Calculate pagination details
        const totalCount = total.length > 0 ? total[0].total : 0;
        const totalPages = Math.ceil(totalCount / limit);
        const nextPage = page < totalPages ? page + 1 : null;
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        res.status(200).json({
            data: data.length > 0 ? data[0].data : [], // Extract data array from aggregation result
            pagination: {
                total: totalCount,
                totalPages,
                nextPage,
                hasNextPage,
                hasPreviousPage,
                limit
            }
        });
    } catch (error) {
        console.error('Error in ViewFiles:', error);
        return res.status(500).json({ error: "Oops, something went wrong" });
    }
};

  module.exports = {addFiles, deleteFile, ViewFiles}



//   try {
//     const { newPDF, category } = req.body;

//     // Check if newPDF contains a promise or unresolved asynchronous data
//     if (typeof newPDF === 'object' && newPDF.then) {
//       // Resolve the promise if it exists
//       newPDF = await newPDF;
//       // console.log(newPDF);
//   }
  
//   // console.log("pdf=> ",newPDF);
//     console.log(typeof newPDF === 'object' && newPDF.then)

//     // Read the existing data from the file
//     const fileData = fs.readFileSync(path.join(__dirname, '..', 'JsonFiles', 'PDFjson.json'), 'utf-8');
//     const jsonData = JSON.parse(fileData);

//     // Apply your updates to the data
//     jsonData[category].unshift(newPDF);

//     // Write the updated data back to the file
//     fs.writeFileSync(path.join(__dirname, '..', 'JsonFiles', 'PDFjson.json'), JSON.stringify(jsonData, null, 2));

//     // Log a message to confirm that the file has been updated
//     console.log('File updated successfully');
//     res.status(201).json({ message: 'success!!' });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }