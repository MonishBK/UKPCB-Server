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

const RecentUpdateSchema = new mongoose.Schema({
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
const RecentUpdate = mongoose.model("RECENTUPDATE", RecentUpdateSchema);
// const Verify = mongoose.model("VERIFY", VerifySchema);

// exporting the modules
module.exports =  RecentUpdate;