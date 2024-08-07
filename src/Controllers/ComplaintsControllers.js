const Complaints = require('../models/ComplaintsSchema')
const {validExtensions} = require('../middlewares/uploadFiles')

const addComplaints = async (req, res) => {
    try {

        const uploadedFiles = req.files;
        
        // if (!uploadedFiles || uploadedFiles.length === 0) {
        //     return res.status(400).json({ error: 'No files were uploaded.' });
        // }
  
        // console.log("Files Uploaded successfully:", uploadedFiles); 
        const { subject, name, email, phone, complaint } = req.body;
        let files = []

        if(uploadedFiles){

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
                    name: ele.filename,
                    href:`/assets/${fileType}/${ele.filename}`,
                    type: fileType
                }
    
                files.push(fileFormat)
    
            })
        }


        const data = new Complaints({ subject, name, email, phone, complaint, files });
        await data.save()
        res.status(201).json({ message: "complaint added successfully", data: data});

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};

const updateComplaintsSeen = async (req, res) => {
    try {
        const { _id } = req.body;
        const currentDate = new Date();
        const dateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        await Complaints.findByIdAndUpdate(_id, { seen_date: dateWithoutTime }, {new: true});
        res.status(201).json({ message: "seen date updated successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};

const updateComplaintsRespondedDate = async (req, res) => {
    try {
        const { _id } = req.body;

        const currentDate = new Date();
        const dateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        await Complaints.findByIdAndUpdate(_id, { responded_date: dateWithoutTime }, {new: true});
        res.status(201).json({ message: "responded date updated successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};

const updateComplaintsNote = async (req, res) => {
    try {
        const { _id, actions } = req.body;

        const data = await Complaints.findByIdAndUpdate(
            _id,
            { $push : { action_notes: actions } },
            { new: true }
        );

        if (!data) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({ message: "Action note updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Oops, something went wrong' });
    }
};

const updateComplaintStatus = async (req, res) => {
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

        await Complaints.findByIdAndUpdate(_id, updateFields, { new: true });
        res.status(201).json({ message: "Successfully updated status and date" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};


const ComplaintStatus = async (req, res) => {
    try {
        const newComplaints = await Complaints.find({ status: 'new' });
        const inProgressComplaints = await Complaints.find({ status: 'in_progress' });
        const resolvedComplaints = await Complaints.find({ status: 'resolved' });

        res.status(200).json({
            new: newComplaints,
            in_progress: inProgressComplaints,
            resolved: resolvedComplaints
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};


const deleteComplaints = async (req, res) => {
    try {
        const { _id } = req.body;

        // Find the complaint to delete
        const complaint = await Complaints.findById(_id);

        // Check if there are any files to delete
        if (complaint.files && complaint.files.length > 0) {
            // Delete each file from the server
            complaint.files.forEach(file => {
                const filePath = path.join(__dirname, '../..', 'public', 'assets', file.type, path.basename(file.name));
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        // Now delete the complaint document
        await Complaints.findByIdAndDelete(_id);
        
        res.status(201).json({ message: "Complaint deleted successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Oops something went wrong' });
    }
};

const ViewSingleComplaint = async (req, res) => {
    try {
        const complaintId = req.params.id; // Assuming id is in params, not _id

        const data = await Complaints.findOne({complaintId:complaintId});

        if (!data) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        return res.status(200).json({ data });
        
    } catch (error) {
        console.error("Error fetching complaint:", error);
        res.status(500).json({ error: 'Oops, something went wrong' });
    }
}

const ViewComplaints = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Define filters based on request parameters
        const filters = {};

        // Filter by complaintId if provided
        if (req.query.complaintId) {
            filters.complaintId = req.query.complaintId;
        }

        // Filter by status if provided
        if (req.query.status) {
            filters.status = req.query.status;
        }

        // Filter by email if provided
        if (req.query.email) {
            filters.email = req.query.email;
        }

        // Filter by subject if provided
        if (req.query.subject) {
            filters.subject = req.query.subject;
        }

        // Filter by phone if provided
        if (req.query.phone) {
            filters.phone = req.query.phone;
        }

        // Filter by name if provided
        if (req.query.name) {
            filters.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive and substring match
        }

        // Filter by date range based on status
        if (req.query.startDate || req.query.endDate) {
            const dateFilter = {};
            if (req.query.startDate) {
                dateFilter.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                dateFilter.$lte = new Date(req.query.endDate);
            }

            if (filters.status === 'in_progress') {
                filters.progress_date = dateFilter;
            } else if (filters.status === 'resolved') {
                filters.resolve_date = dateFilter;
            } else {
                // For status 'new' or unspecified status
                filters.createdAt = dateFilter;
            }
        }

        // Apply filters and pagination
        const data = await Complaints.find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Count total number of documents
        const total = await Complaints.countDocuments(filters);

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
        console.error(err);
        res.status(500).json({ error: 'Oops something went wrong' });
    }
};

module.exports = { addComplaints, updateComplaintsSeen, updateComplaintsRespondedDate,
    updateComplaintStatus, ComplaintStatus, deleteComplaints, ViewSingleComplaint, ViewComplaints, updateComplaintsNote }