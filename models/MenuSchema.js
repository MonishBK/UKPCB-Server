const mongoose = require("mongoose");

const mainMenuSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim:true,
    },
    href: {
      type: String,
      required: true,
      trim:true,
    },
    order: {
      type: Number,
      required: true,
      trim:true,
    },
    subItems: {
      type: Array,
      default: [],
      }
       
  });

const sideMenuSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim:true,
    },
    href: {
      type: String,
      required: true,
      trim:true,
    },
    order: {
      type: Number,
      required: true,
      trim:true,
    },
    subItems: {
      type: Array,
      default: [],
      }
       
  });

  
// collection creation
const MainMenu = mongoose.model("MAINMENU", mainMenuSchema);
const SideMenu = mongoose.model("SIDEMENU", sideMenuSchema);
// const Verify = mongoose.model("VERIFY", VerifySchema);

// exporting the modules
module.exports =  {MainMenu, SideMenu};