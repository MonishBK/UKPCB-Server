const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate")


const {registerUser, signInUser, logOutUser, 
    LoutOutAllDevicesUser, updateEmailUser, updateNumberUser, 
    UpdatePasswordUser, getUser, deleteUserAccount, getSingleUser, 
    forgotPasswordUser, matchOTPUser, changePasswordOTPUser} = require("../Controllers/UserControllers")
    

// const {sendNotification} = require("../Controllers/PushNotifications")

// ===================== User API =======================

// user Registration 
router.post('/register', registerUser);

// user login 
router.post("/signIn", signInUser); 

// user Logout
router.get("/logout", Authenticate , logOutUser);

// user Logout All
router.get("/logout-all-devices", Authenticate , LoutOutAllDevicesUser);

// Update Email
router.patch("/update-email/:id", updateEmailUser);

// Update Number
router.patch("/update-number/:id", updateNumberUser);

// Update Password
router.patch("/update-pass/:id", UpdatePasswordUser);

//user data fetching
router.get('/fetch-User-data', Authenticate , getUser); 

// Delete User Account
router.delete("/delete-acc/:id", deleteUserAccount);


// try git

module.exports = router;