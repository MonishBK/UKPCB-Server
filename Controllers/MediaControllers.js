const Media = require('../models/mediaSchema')
const fs = require('fs/promises'); // Using promises-based fs module
const path = require('path');


  const addMedia = async (req, res) => {
    try {
        const { name, description, data } = req.body;

        const mediaData = new Media({ name, description, data });
        await mediaData.save()
        res.status(201).json({ message: "Added successfully" });

    } catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong' });
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
        const serverMediaPath = path.join(__dirname, '..', 'public', 'assets', fileToRemove.type, path.basename(fileToRemove.href));
        await fs.unlink(serverMediaPath);

        // Remove the file from the data array in MongoDB
        mediaDoc.data = mediaDoc.data.filter(file => file.href !== href);

        // Save the updated document
        await mediaDoc.save();

        res.status(200).json({ message: 'Media deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(422).json({ error: err.message });
    }
};


const ViewMedia = async (req, res) => {
    try {
        // Find and sort the main menu items by the 'order' field
        const data = await Media.find();

        res.status(200).json({ data });
    } catch (error) {
        return res.status(422).json({ error: "Oops, something went wrong" });
    }
};

module.exports = {addMedia, deleteMedia, ViewMedia}