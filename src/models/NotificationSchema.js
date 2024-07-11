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

const NotificationSchema = new mongoose.Schema({
    Module : {
      type: String,
      required: true,
      trim:true,
    },
    title: {
      type: String,
      required: true,
      trim:true,
    },
    Publish_Date: {
      type: String,
      required: true,
      trim:true,
    },
    files: [fileDataSchema],
       
  },{ timestamps: true } );

  // collection creation
const Notification = mongoose.model("NOTIFICATION", NotificationSchema);
// const Verify = mongoose.model("VERIFY", VerifySchema);

// exporting the modules
module.exports =  Notification;