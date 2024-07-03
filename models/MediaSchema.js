const mongoose = require("mongoose");

const mediaDataSchema = new mongoose.Schema({
    media_name: {
        type: String,
        // required: true,
        trim: true,
    },
    href: {
        type: String,
        // required: true,
        trim: true,
    },
    type: {
        type: String,
        // required: true,
        trim: true, 
    }
});

const mediaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    data: [mediaDataSchema]
});

const Media = mongoose.model('MEDIA', mediaSchema);

module.exports = Media;