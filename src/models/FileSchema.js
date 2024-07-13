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
    },
},{ timestamps: true } );

const fileSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
        trim: true,
    },
    data: [fileDataSchema]
});

const File = mongoose.model('FILE', fileSchema);

module.exports = File;