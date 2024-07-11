const mongoose = require("mongoose");

const fileDataSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    href: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        trim: true,
    }
});


const actionNoteSchema = new mongoose.Schema({
    status: {
        type: String,
        trim: true,
    },
    note: {
        type: String,
        trim: true,
    }
},{ timestamps: true } );


const enquiriesSchema = new mongoose.Schema({
    enquiryId: {
        type: String,
        unique: true
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    enquiry: {
        type: String,
        required: true,
        trim: true,
    },
    files: [fileDataSchema],

    seen_date: {
        type: Date,
        default: null,
    },
    responded_date: {
        type: Date,
        default: null,
    },
    progress_date: {
        type: Date,
        default: null,
    },
    resolve_date: {
        type: Date,
        default: null,
    },
    action_notes: [actionNoteSchema],
    status: {
        type: String,
        trim: true,
        default: "new"
    }
},{ timestamps: true } );


enquiriesSchema.pre('save', async function (next) {
    try {
        if (!this.enquiryId) {
            // Generate enquiryId if it doesn't exist
            const lastEnquiry = await Enquiries.findOne({}, {}, { sort: { 'createdAt': -1 } });
            let count = 1;
            if (lastEnquiry && lastEnquiry.enquiryId) {
                const lastNumber = parseInt(lastEnquiry.enquiryId.substring(7)); // Extract numeric part
                count = lastNumber + 1;
            }
            this.enquiryId = `UKPCBEQ${count.toString().padStart(3, '0')}`;
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Enquiries = mongoose.model('ENQUIRIE', enquiriesSchema);

module.exports = Enquiries;

