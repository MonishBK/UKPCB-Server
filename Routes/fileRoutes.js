const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate")
const {upload} = require('../middlewares/uploadFiles')

const {addFiles, deleteFile, ViewFiles} = require('../Controllers/FilesControllers')


// Upload multiple files
router.post('/upload/e-files', upload.array("files", 10), Authenticate, addFiles);

// delete file
router.delete('/delete-file', Authenticate, deleteFile);

// fetch files
router.get('/fetch-file', ViewFiles);



module.exports = router;