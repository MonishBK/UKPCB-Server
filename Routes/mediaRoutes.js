const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate")
const {upload, uploadFiles} = require('../Components/uploadFiles')

const {addMedia, deleteMedia, ViewMedia} = require('../Controllers/MediaControllers')



// Upload multiple files
router.post('/upload/e-files', upload.array("files", 10), uploadFiles);

// add file
router.post('/update/media-file', Authenticate, addMedia);

// delete file
router.delete('/delete-media-file', Authenticate, deleteMedia);

// fetch files
router.get('/fetch-media', ViewMedia);



module.exports = router;