const RecentUpdate = require('../models/RecentUpdateSchema')
const fs = require('fs/promises'); // Using promises-based fs module
const path = require('path');
const {validExtensions}= require('../middlewares/uploadFiles')


  const addRecentUpdate = async (req, res) => {
    const uploadedFiles = req.file;
    
    try {
        
        if(uploadedFiles){
            const { Module, title, custom_file_name} = req.body;
            
            const fileExtension = uploadedFiles.originalname.split('.').pop().toLowerCase();
                let fileType = null;
          
                // Find the file type based on the extension
                for (const [type, extensions] of Object.entries(validExtensions)) {
                    if (extensions.includes(fileExtension)) {
                        fileType = type;
                        break;
                    }
                }
    
                const file_data = {
                    custom_file_name: custom_file_name,
                    href: `/assets/${fileType}/${uploadedFiles.filename}`,
                    type: fileType
                }
    
                const data = new RecentUpdate({Module: Module, title:title, files: file_data});
        
                // Save the updated or new document
                await data.save();
        
                res.status(201).json({ message: 'Success!!' });
        }else{
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

    } catch (err) {
        console.log(err);
        fs.unlink(uploadedFiles.path);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};

const deleteRecentUpdateFiles = async (req, res) => {
    try {
        const { _id, file_href } = req.body;

        // Find the document by _id
        const notificationDoc = await RecentUpdate.findById(_id);

        if (!notificationDoc) {
            return res.status(404).json({ error: "RecentUpdate not found" });
        }

        // Delete files from the server and update MongoDB document
        for (const href of file_href) {
            // Find the file to be removed
            const fileToRemove = notificationDoc.files.find(file => file.href === href);

            if (!fileToRemove) {
                console.log(`File with href ${href} not found in notification ${_id}`);
                continue;
            }

            // Delete the file from the server
            const serverFilePath = path.join(__dirname, '../..', 'public', 'assets', fileToRemove.type, path.basename(fileToRemove.href));
            await fs.unlink(serverFilePath);

            // Remove the file from the files array in MongoDB
            notificationDoc.files = notificationDoc.files.filter(file => file.href !== href);
        }

        // Save the updated document
        await notificationDoc.save();

        res.status(200).json({ message: 'Files deleted successfully', notification: notificationDoc });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

const deleteRecentUpdate = async (req, res) => {
    try {
        const { _id } = req.body;

        // Find the document by _id
        const notificationDoc = await RecentUpdate.findById(_id);

        if (!notificationDoc) {
            return res.status(404).json({ error: "RecentUpdate not found" });
        }

        // Delete files from the server
        for (const file of notificationDoc.files) {
            const serverFilePath = path.join(__dirname, '../..', 'public', 'assets', file.type, path.basename(file.href));
            await fs.unlink(serverFilePath);
        }

        // Delete the notification document from MongoDB
        await RecentUpdate.findByIdAndDelete(_id);

        res.status(200).json({ message: 'RecentUpdate and associated files deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};


const ViewSingleRecentUpdate = async (req, res) => {
    try {
        const _id = req.params.id;
        
        // Find and sort the main menu items by the 'order' field
        const data = await RecentUpdate.findById(_id);

        res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ error: "Oops, something went wrong" });
    }
};

const ViewRecentUpdates = async (req, res) => {
    try {
        // Find and sort the main menu items by the 'order' field
        const data = await RecentUpdate.find().sort({ createdAt: -1 });

        res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ error: "Oops, something went wrong" });
    }
};

  module.exports = {addRecentUpdate, deleteRecentUpdateFiles, deleteRecentUpdate, ViewSingleRecentUpdate, ViewRecentUpdates}