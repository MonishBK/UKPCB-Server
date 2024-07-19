const Notification = require('../models/NotificationSchema')
const fs = require('fs/promises'); // Using promises-based fs module
const path = require('path');
const {validExtensions}= require('../middlewares/uploadFiles')


  const addNotification = async (req, res) => {
    const uploadedFiles = req.file;
    
    try {
        
        if(uploadedFiles){
            const { custom_file_name, notice_title } = req.body;
            
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
                    custom_file_name:custom_file_name,
                    href:`/assets/${fileType}/${uploadedFiles.filename}`,
                    type: fileType
                }
    
                const data = new Notification({notice_title: notice_title, file_data:file_data });
        
                // Save the updated or new document
                await data.save();
        
                res.status(201).json({ message: 'Success!!' });
        }else{
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

    } catch (err) {
        console.log(err);
        fs.unlink(uploadedFiles.path)
        res.status(500).json({ error: 'Oops some thing went wrong' });
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

        // Delete the file from the server
        const serverFilePath = path.join(__dirname, '../..', 'public', 'assets', notificationDoc?.file_data?.type, path.basename(notificationDoc?.file_data?.href));
        await fs.unlink(serverFilePath);

        await Notification.findByIdAndDelete(_id)

        res.status(200).json({ message: 'Files deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};



const ViewNotification = async (req, res) => {
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

  module.exports = {addNotification, deleteNotification, ViewNotification, ViewNotifications}