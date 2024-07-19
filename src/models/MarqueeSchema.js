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

const marqueeSchema = new mongoose.Schema({
    marquee_title: {
        type: String,
        required: true,
        trim: true,
    },
    file_data: fileDataSchema
},{ timestamps: true });

const Marquee = mongoose.model('MARQUEE', marqueeSchema);

module.exports = Marquee;
