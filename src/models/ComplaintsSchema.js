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
    },
    date: {
        type: String,
        trim: true,
    }
},{ timestamps: true } );

const complaintsSchema = new mongoose.Schema({
    complaintId: {
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
    complaint: {
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

complaintsSchema.pre('save', async function (next) {
    try {
        if (!this.complaintId) {
            // Generate complaintId if it doesn't exist
            const lastComplaint = await Complaints.findOne({}, {}, { sort: { 'createdAt': -1 } });
            let count = 1;
            if (lastComplaint && lastComplaint.complaintId) {
                const lastNumber = parseInt(lastComplaint.complaintId.substring(7)); // Extract numeric part
                count = lastNumber + 1;
            }
            this.complaintId = `UKPCBCO${count.toString().padStart(3, '0')}`;
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Complaints = mongoose.model('COMPLAINT', complaintsSchema);

module.exports = Complaints;