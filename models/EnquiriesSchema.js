const mongoose = require("mongoose");

const enquiriesSchema = new mongoose.Schema({
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
    createdOn: {
        type: String,
        default: new Date().toLocaleString(),
    },
});

const Enquiries = mongoose.model('ENQUIRIE', enquiriesSchema);

module.exports = Enquiries;