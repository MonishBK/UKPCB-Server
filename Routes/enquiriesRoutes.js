const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate")
const {upload} = require('../middlewares/uploadFiles')
const {addEnquiries, updateEnquiriesSeen, updateEnquiriesRespondedDate, 
    deleteEnquiries, ViewEnquiries} = require('../Controllers/EnquiriesControllers')


// add enquiries
router.post('/add-enquiries', upload.array("files", 10), addEnquiries);

// update enquiries seen date
router.patch('/modify-enquiries-seen', Authenticate, updateEnquiriesSeen);

// update enquiries responded date
router.patch('/modify-enquiries-responded-date', Authenticate, updateEnquiriesRespondedDate);

// delete enquiries
router.delete('/delete-enquiries', Authenticate, deleteEnquiries);

// fetch enquiries
router.get('/fetch-enquiries', ViewEnquiries);



module.exports = router;