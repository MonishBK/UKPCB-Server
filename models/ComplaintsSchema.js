const mongoose = require("mongoose");


const fileDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    href: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    }
});

const complaintsSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    Name: {
        type: String,
        required: true,
        trim: true,
    },
    Email: {
        type: String,
        required: true,
        trim: true,
    },
    Phone: {
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

    Seen_date: {
        type: String,
        default: null,
        trim: true,
    },
    Responded_date: {
        type: String,
        trim: true,
        default: null
    },
    createdAt: {
        type: String,
        default: new Date().toLocaleString(),
    },
});

const Complaints = mongoose.model('COMPLAINT', complaintsSchema);

module.exports = Complaints;