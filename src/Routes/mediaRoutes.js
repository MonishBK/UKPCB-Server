const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate")
const {upload} = require('../middlewares/uploadFiles')

const {addMedia, UploadMoreMedia, deleteMedia, ViewSingleMedia, deleteEventMedia, ViewMedia} = require('../Controllers/MediaControllers')



// Upload multiple files
router.post('/upload/media-file', upload.array("files", 10), Authenticate, addMedia);

// update multiple files
router.post('/update/media-file', upload.array("files", 10), Authenticate, UploadMoreMedia);

// delete file
router.delete('/delete-media-file', Authenticate, deleteMedia);

// delete event
router.delete('/delete-media-event', Authenticate, deleteEventMedia);

// fetch single files
router.get('/fetch-single-media/:_id', ViewSingleMedia);

// fetch files
router.get('/fetch-media', ViewMedia);



module.exports = router;