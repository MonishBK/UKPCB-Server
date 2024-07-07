const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate")
const {upload} = require('../middlewares/uploadFiles')

const {addMedia, deleteMedia, ViewMedia} = require('../Controllers/MediaControllers')



// Upload multiple files
router.post('/update/media-file', upload.array("files", 10), addMedia);

// delete file
router.delete('/delete-media-file', Authenticate, deleteMedia);

// fetch files
router.get('/fetch-media', ViewMedia);



module.exports = router;