const Enquiries = require('../models/EnquiriesSchema')
const {validExtensions} = require('../middlewares/uploadFiles')

const addEnquiries = async (req, res) => {
    try {

        const uploadedFiles = req.files;
        
        // if (!uploadedFiles || uploadedFiles.length === 0) {
        //     return res.status(400).json({ error: 'No files were uploaded.' });
        // }
  
        // console.log("Files Uploaded successfully:", uploadedFiles); 
        const { subject, name, email, phone, enquiry } = req.body;
        let files = []

        uploadedFiles.map((ele, ind) => {
            
            const fileExtension = ele.originalname.split('.').pop().toLowerCase();
            let fileType = null;
      
            // Find the file type based on the extension
            for (const [type, extensions] of Object.entries(validExtensions)) {
                if (extensions.includes(fileExtension)) {
                    fileType = type;
                    break;
                }
            }

            const fileFormat = {
                name: uploadedFiles.filename,
                href:`/assets/${fileType}/${uploadedFiles.filename}`,
                type: fileType
            }

            files.push(fileFormat)

        })

        const data = new Enquiries({ subject, name, email, phone, enquiry, files });
        await data.save()
        res.status(201).json({ message: "Added successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};

const updateEnquiriesSeen = async (req, res) => {
    try {
        const { _id } = req.body;
        const currentDate = new Date();
        const dateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        await Enquiries.findByIdAndUpdate(_id, { seen_date: dateWithoutTime }, {new: true});
        res.status(201).json({ message: "successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};

const updateEnquiriesRespondedDate = async (req, res) => {
    try {
        const { _id } = req.body;
        const currentDate = new Date();
        const dateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        await Enquiries.findByIdAndUpdate(_id, { responded_date: dateWithoutTime }, {new: true});
        res.status(201).json({ message: "successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};

const updateEnquiryNote = async (req, res) => {
    try {
        const { _id, actions } = req.body;

        const data = await Enquiries.findByIdAndUpdate(
            _id,
            { $unshift : { action_notes: actions } },
            { new: true }
        );

        if (!data) {
            return res.status(404).json({ message: "Complaint not found" });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};

const updateEnquiryStatus = async (req, res) => {
    try {
        const { _id, status } = req.body;

        const currentDate = new Date();
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        // Update fields based on status
        let updateFields = { status };

        switch (status) {
            case 'in_progress':
                updateFields.progress_date = date;
                break;
            case 'resolved':
                updateFields.resolve_date = date;
                break;
            default:
                break;
        }

        await Enquiries.findByIdAndUpdate(_id, updateFields, { new: true });
        res.status(201).json({ message: "Successfully updated status and date" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};

const deleteEnquiries = async (req, res) => {
    try {
        const { _id } = req.body;

        await Enquiries.findByIdAndDelete(_id);
        res.status(201).json({ message: "successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};

const EnquiryStatus = async (req, res) => {
    try {
        const newEnquiries = await Enquiries.find({ status: 'new' });
        const inProgressEnquiries = await Enquiries.find({ status: 'in_progress' });
        const resolvedEnquiries = await Enquiries.find({ status: 'resolved' });

        res.status(200).json({
            new: newEnquiries,
            in_progress: inProgressEnquiries,
            resolved: resolvedEnquiries
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};

const ViewEnquiries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Define filters based on request parameters
        const filters = {};

        // Filter by enquiryId if provided
        if (req.query.enquiryId) {
            filters.enquiryId = req.query.enquiryId;
        }

        // Filter by status if provided
        if (req.query.status) {
            filters.status = req.query.status;
        }

        // Filter by date range based on status
        if (req.query.startDate || req.query.endDate) {
            if (filters.status === 'in_progress') {
                filters.progress_date = {};
                if (req.query.startDate) {
                    filters.progress_date.$gte = new Date(req.query.startDate);
                }
                if (req.query.endDate) {
                    filters.progress_date.$lte = new Date(req.query.endDate);
                }
            } else if (filters.status === 'resolved') {
                filters.resolve_date = {};
                if (req.query.startDate) {
                    filters.resolve_date.$gte = new Date(req.query.startDate);
                }
                if (req.query.endDate) {
                    filters.resolve_date.$lte = new Date(req.query.endDate);
                }
            } else {
                // For status 'new'
                filters.createdAt = {};
                if (req.query.startDate) {
                    filters.createdAt.$gte = new Date(req.query.startDate);
                }
                if (req.query.endDate) {
                    filters.createdAt.$lte = new Date(req.query.endDate);
                }
            }
        }

        // Apply filters and pagination
        const data = await Enquiries.find(filters)
                                    .skip(skip)
                                    .limit(limit);
        
        // Count total number of documents
        const total = await Enquiries.countDocuments(filters);

        // Calculate pagination details
        const totalPages = Math.ceil(total / limit);
        const nextPage = page < totalPages ? page + 1 : null;
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        // Send response
        res.status(200).json({
            data,
            pagination: {
                total,
                totalPages,
                nextPage,
                hasNextPage,
                hasPreviousPage,
                limit
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops something went wrong' });
    }
};

module.exports = { addEnquiries, updateEnquiriesSeen, updateEnquiriesRespondedDate, 
    deleteEnquiries, ViewEnquiries, updateEnquiryStatus, EnquiryStatus, updateEnquiryNote }