const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate");
const {upload} = require('../middlewares/uploadFiles')

const {addRecentUpdate, deleteRecentUpdateFiles, deleteRecentUpdate, ViewSingleRecentUpdate, ViewRecentUpdates} = require('../Controllers/RecentUpdateControllers')


// Add RecentUpdate
router.post('/upload/e-files', upload.array("files", 10), Authenticate, addRecentUpdate);

// delete recent-update files
router.delete('/delete-recent-update-files', Authenticate, deleteRecentUpdateFiles);

// delete recent-update
router.delete('/delete-recent-update', Authenticate, deleteRecentUpdate);

// fetch single recent-updates
router.get('/fetch-single-recent-update/:id', ViewSingleRecentUpdate);

// fetch recent-updates
router.get('/fetch-recent-updates', ViewRecentUpdates);


module.exports = router;