const Notification = require('../models/NotificationSchema')
const fs = require('fs/promises'); // Using promises-based fs module
const path = require('path');
const {validExtensions}= require('../middlewares/uploadFiles')


  const addNotification = async (req, res) => {
    try {
        const uploadedFiles = req.files;
        
        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }
  
        console.log("Files Uploaded successfully:", uploadedFiles); 
        const { Module, title, Publish_Date, names } = req.body;
        let files = []

        uploadedFiles.map((ele, ind) => {
            
            const fileExtension = ele.originalname.split('.').pop().toLowerCase();
            let fileType = null;
      
            // Find the file type based on the extension
            for (const [type, extensions] of Object.entries(validExtensions)) {
                if (extensions.includes(fileExtension)) {
                    fileType = type;
                    break;
                }
            }

            const fileFormat = {
                name: names[ind],
                href:`/assets/${fileType}/${ele.filename}`,
                type: fileType
            }

            files.push(fileFormat)

        })


        
        const data = new Notification({ Module, title, Publish_Date, files });
        await data.save()
        res.status(201).json({ message: "Added successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};

const deleteNotificationFiles = async (req, res) => {
    try {
        const { _id, fileHrefs } = req.body;

        // Find the document by _id
        const notificationDoc = await Notification.findById(_id);

        if (!notificationDoc) {
            return res.status(404).json({ error: "Notification not found" });
        }

        // Delete files from the server and update MongoDB document
        for (const href of fileHrefs) {
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

const deleteNotification = async (req, res) => {
    try {
        const { _id } = req.body;

        // Find the document by _id
        const notificationDoc = await Notification.findById(_id);

        if (!notificationDoc) {
            return res.status(404).json({ error: "Notification not found" });
        }

        // Delete files from the server
        for (const file of notificationDoc.files) {
            const serverFilePath = path.join(__dirname, '../..', 'public', 'assets', file.type, path.basename(file.href));
            await fs.unlink(serverFilePath);
        }

        // Delete the notification document from MongoDB
        await Notification.findByIdAndDelete(_id);

        res.status(200).json({ message: 'Notification and associated files deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};


const ViewSingleNotification = async (req, res) => {
    try {
        const _id = req.params.id;
        
        // Find and sort the main menu items by the 'order' field
        const data = await Notification.findById(_id);

        res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ error: "Oops, something went wrong" });
    }
};

const ViewNotifications = async (req, res) => {
    try {
        // Find and sort the main menu items by the 'order' field
        const data = await Notification.find().sort({ createdAt: -1 });

        res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ error: "Oops, something went wrong" });
    }
};

  module.exports = {addNotification, deleteNotificationFiles, deleteNotification, ViewSingleNotification, ViewNotifications}