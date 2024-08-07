const mongoose = require("mongoose");

const fileDataSchema = new mongoose.Schema({
    href: {
        type: String,
        required: true,
        trim: true,
    },
    custom_file_name : {
      type: String,
      required: true,
      trim:true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    }
});

const NotificationSchema = new mongoose.Schema({
    notice_title: {
      type: String,
      required: true,
      trim:true,
    },
    file_data: [fileDataSchema],
       
  },{ timestamps: true } );

  // collection creation
const Notification = mongoose.model("NOTIFICATION", NotificationSchema);
// const Verify = mongoose.model("VERIFY", VerifySchema);

// exporting the modules
module.exports =  Notification;