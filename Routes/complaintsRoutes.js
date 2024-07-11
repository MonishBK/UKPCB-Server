const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate")
const {upload} = require('../middlewares/uploadFiles')
const {addComplaints, updateComplaintsSeen, updateComplaintsRespondedDate, updateComplaintStatus, ComplaintStatus,
    deleteComplaints, ViewComplaints, updateComplaintsNote} = require('../Controllers/ComplaintsControllers')


// add complaints
router.post('/add-complaints', upload.array("files", 10), addComplaints);

// update complaints seen date
router.patch('/update-complaints-seen', Authenticate, updateComplaintsSeen);

// update complaints responded date
router.patch('/update-complaints-responded-date', Authenticate, updateComplaintsRespondedDate);

// update complaints responded date
router.patch('/update-complaints-status', Authenticate, updateComplaintStatus);

// update complaints action note
router.patch('/update-complaints-action-note', Authenticate, updateComplaintsNote);

// delete complaints
router.delete('/delete-complaints', Authenticate, deleteComplaints);

// fetch complaints
router.get('/fetch-complaint-status', ComplaintStatus);

// fetch complaints
router.get('/fetch-complaints', ViewComplaints);



module.exports = router;