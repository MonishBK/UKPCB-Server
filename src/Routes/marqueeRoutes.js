const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/uploadFiles'); // Assuming `upload` is set up for file handling
const {
    createMarquee,
    getAllMarquees,
    getMarqueeById,
    deleteMarquee
} = require('../Controllers/MarqueeControllers');
const Authenticate = require("../middlewares/authenticate")

// Create Marquee
router.post('', upload.single('file'), Authenticate, createMarquee);

// Get All Marquees
router.get('', getAllMarquees);

// Get Single Marquee
router.get('/:id', getMarqueeById);

// Delete Marquee
router.delete('/:id', Authenticate, deleteMarquee);

module.exports = router;
