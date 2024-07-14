const mongoose = require("mongoose");

const mediaDataSchema = new mongoose.Schema({
    media_name: {
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
    eventDate: {
        type: String,
        trim: true,
    },
    data: [mediaDataSchema],
},{ timestamps: true } );

const Media = mongoose.model('MEDIA', mediaSchema);

module.exports = Media;