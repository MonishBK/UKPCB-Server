const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate")
const {upload} = require('../middlewares/uploadFiles')
const {addComplaints, updateComplaintsSeen, updateComplaintsRespondedDate, 
    deleteComplaints, ViewComplaints} = require('../Controllers/ComplaintsControllers')


// add complaints
router.post('/add-complaints', upload.array("files", 10), addComplaints);

// update complaints seen date
router.patch('/modify-complaints-seen', Authenticate, updateComplaintsSeen);

// update complaints responded date
router.patch('/modify-complaints-responded-date', Authenticate, updateComplaintsRespondedDate);

// delete complaints
router.delete('/delete-complaints', Authenticate, deleteComplaints);

// fetch complaints
router.get('/fetch-complaints', ViewComplaints);



module.exports = router;