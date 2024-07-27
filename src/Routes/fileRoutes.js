const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate")
const {upload} = require('../middlewares/uploadFiles')

const {addFiles, deleteFile, FetchFiles, SearchFiles} = require('../Controllers/FilesControllers')


// Upload multiple files
router.post('/upload/e-files', upload.single("file"), Authenticate, addFiles);

// delete file
router.delete('/delete-file', Authenticate, deleteFile);

// fetch files
router.get('/fetch-file', FetchFiles);

// search files
router.get('/search-file', SearchFiles);



module.exports = router;