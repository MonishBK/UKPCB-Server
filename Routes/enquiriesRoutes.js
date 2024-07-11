const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate")
const {upload} = require('../middlewares/uploadFiles')
const {addEnquiries, updateEnquiriesSeen, updateEnquiriesRespondedDate, updateEnquiryStatus, EnquiryStatus,
    deleteEnquiries, ViewEnquiries, updateEnquiryNote} = require('../Controllers/EnquiriesControllers')


// add enquiries
router.post('/add-enquiries', upload.array("files", 10), addEnquiries);

// update enquiries seen date
router.patch('/update-enquiries-seen', Authenticate, updateEnquiriesSeen);

// update enquiries responded date
router.patch('/update-enquiries-responded-date', Authenticate, updateEnquiriesRespondedDate);

// update enquiries status
router.patch('/update-enquiries-status', Authenticate, updateEnquiryStatus);

// update enquiries status
router.patch('/update-enquiries-action-note', Authenticate, updateEnquiryNote);

// delete enquiries
router.delete('/delete-enquiries', Authenticate, deleteEnquiries);

// fetch enquiry status
router.get('/fetch-enquiries-status', ViewEnquiries);

// fetch enquiries
router.get('/fetch-enquiries', ViewEnquiries);



module.exports = router;