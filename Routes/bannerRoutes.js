const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate")
const {upload} = require('../middlewares/uploadFiles')
const {addBanner, deleteBanner, ViewBanner} = require('../Controllers/BannerControllers')



// Upload banner
router.post('/upload/e-files', upload.single("files"), Authenticate, addBanner);

// delete banner
router.delete('/delete-banner', Authenticate, deleteBanner);

// fetch banner
router.get('/fetch-banner', ViewBanner);



module.exports = router;