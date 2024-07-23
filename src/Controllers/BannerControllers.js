const Banner = require('../models/BannerSchema')
const fs = require('fs/promises'); // Using promises-based fs module
const path = require('path');

const validExtensions = {
    Photo: ['jpg', 'jpeg', 'png'],
    Video: ['mp4', 'avi', 'mov']
  };


  const addBanner = async (req, res) => {
    try {
        const uploadedFiles = req.file;
        
        if (!uploadedFiles) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

        const fileExtension = uploadedFiles.originalname.split('.').pop().toLowerCase();
        let fileType = null;
  
        // Find the file type based on the extension
        for (const [type, extensions] of Object.entries(validExtensions)) {
            if (extensions.includes(fileExtension)) {
                fileType = type;
                break;
            }
        }

        const { name } = req.body; 

        const href = `/assets/${fileType}/${uploadedFiles.filename}`

        const mediaData = new Banner({ name, href, type:fileType });
        await mediaData.save()
        res.status(201).json({ message: "Added successfully" });  

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};


const deleteBanner = async (req, res) => {
    try {
        const { _id } = req.body;

        // Find the document by path
        const bannerDoc = await Banner.findById(_id);

        if (!bannerDoc) {
            return res.status(404).json({ error: "banner not exists" });
        }

        // Find the file to be removed
        const fileToRemove = bannerDoc.href;

        if (!fileToRemove) {
            return res.status(404).json({ error: "Banner not found" });
        }

        // Delete the file from the server
        const serverBannerPath = path.join(__dirname, '../..', 'public', 'assets', bannerDoc.type, path.basename(fileToRemove));
        await fs.unlink(serverBannerPath);

        // Remove the file from the data array in MongoDB
        await Banner.findByIdAndDelete(_id)

        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};


const ViewBanner = async (req, res) => {
    try {
        // Find and sort the main menu items by the 'order' field
        const data = await Banner.find().sort({ createdAt: -1 });

        res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ error: "Oops, something went wrong" });
    }
};

module.exports = {addBanner, deleteBanner, ViewBanner}