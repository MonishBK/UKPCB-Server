const Enquiries = require('../models/EnquiriesSchema')
const {validExtensions} = require('../middlewares/uploadFiles')

const addEnquiries = async (req, res) => {
    try {

        const uploadedFiles = req.files;
        
        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }
  
        // console.log("Files Uploaded successfully:", uploadedFiles); 
        const { subject, Name, Email, Phone, enquiry } = req.body;
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

        const data = new Enquiries({ subject, Name, Email, Phone, enquiry, files });
        await data.save()
        res.status(201).json({ message: "Added successfully" });

    } catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong' });
    }
};

const updateEnquiriesSeen = async (req, res) => {
    try {
        const { _id, Seen_date } = req.body;

        const data = await Enquiries.findByIdAndUpdate(_id, { Seen_date }, {new: true});
        res.status(201).json({ message: "successfully" });

    } catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong' });
    }
};

const updateEnquiriesRespondedDate = async (req, res) => {
    try {
        const { _id, Responded_date } = req.body;

        const data = await Enquiries.findByIdAndUpdate(_id, { Responded_date }, {new: true});
        res.status(201).json({ message: "successfully" });

    } catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong' });
    }
};

const deleteEnquiries = async (req, res) => {
    try {
        const { _id } = req.body;

        await Enquiries.findByIdAndDelete(_id);
        res.status(201).json({ message: "successfully" });

    } catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong' });
    }
};

const ViewEnquiries = async (req, res) => {
    try {

        const data = await Enquiries.find();
        res.status(200).json({ data });

    } catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong' });
    }
};

module.exports = { addEnquiries, updateEnquiriesSeen, updateEnquiriesRespondedDate, deleteEnquiries, ViewEnquiries }