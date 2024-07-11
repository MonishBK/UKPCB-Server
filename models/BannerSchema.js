const mongoose = require("mongoose");


const bannerSchema = new mongoose.Schema({
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
},{ timestamps: true } );

const Banner = mongoose.model('BANNER', bannerSchema);

module.exports = Banner;