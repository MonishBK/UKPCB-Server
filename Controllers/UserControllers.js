const User = require("../models/UserSchema")
const bcrypt = require("bcryptjs")


const registerUser  = async (req, res) =>{
    const {email, password} = req.body;
    // console.log("inside the registerUser")
    
    if(!email || !password ){
        // console.log("fill all data")
        return res.status(422).json({error : "Plz fill all the field"});
    }
    
    try{

        const UserExist = await User.findOne({email : email});

        if( UserExist ){
            // console.log("Email already exist")
            return res.status(409).json({error : "Email already exist",data: "email"});
        }else {
            // console.log("inside the else loop")
            const user = new User({ email, password});
            await user.save();
            res.status(201).json({ message: "Register Successful" });
        }

    } catch (err) {
        // console.log(err);
        return res.status(500).json({error : "Oops something went wrong"});
    }
}

const signInUser = async (req, res) =>{
    try{

        let token; 
        const { email, password } = req.body;
        // const email = req.body.email;
        // console.log(email, number, "" === undefined, (!number || !password) &&  (!email || !password));

        if(email !== undefined){
        //    console.log("inside email ", email, password)
            if(email){
                var UserLogin = await User.findOne( { email: email } );
            }

        }else{
            // console.log("in else statement")
            return res.status(400).json({error : "invalid login details"});
        } 

        var UserLogin = await User.findOne( { email: email } );

        if(UserLogin){
            const isMatch = await bcrypt.compare(password, UserLogin.password);

            token = await UserLogin.generateAuthToken();
            // console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })
            // console.log("matching", isMatch)
            if(!isMatch){
                // console.log("inside is Match")
                res.status(400).json({ error : "Invalid Credential"});
            } else {
                // console.log("inside is Match true")
                res.status(200).json({ message : "user SignIn successfully!!..",token });
            }
        }else{
            // console.log("didn't get the user")
            res.status(400).json({ error : "Invalid Credential"}); 
        }


    } catch (err) {
        // console.log(err);
        res.status(500).json({ error :"Oops something went wrong"});
    }
}

const logOutUser = async (req, res) =>{
    try {
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !==  req.token;
        })

        await req.user.save();
        
        res.clearCookie("jwtoken");

        res.status(200).json({ message : "user Logout successfully!!..", });

    } catch (err) {
        console.log(err)
        res.status(500).json({ error : "user Logout Unsuccessfully!!..", });

    }
}

const LoutOutAllDevicesUser = async (req, res) => {
    try {

        req.user.tokens = []; 
        await req.user.save();
        

        res.clearCookie("jwtoken", {path:'/'});

        res.status(200).json({ message : "user Logout successfully!!..", });

    } catch (error) {
        res.status(500).json({ error : "user Logout Unsuccessfully!!..", });

    }
} 

const updateEmailUser = async (req, res) =>{
    try {
        const _id = req.params.id;
        const {email} = req.body;

        if(!email.trim()){
            return res.status(422).json({error : "Plz fill the field"});
        }
        // console.log("after inside")
        const UserExist = await User.findOne({email});
        // console.log("after fetching", UserExist)
        if( UserExist ){
            // console.log("Email already exist")
            return res.status(409).json({error : "Email already exist"});
        }
        await User.findByIdAndUpdate( _id, {email},{
            new : true
        });
        res.status(201).json({ message: "email updated successfully"});
        // console.log("email Updated successfully")
    } catch (err) {
        // console.log(err);
        res.status(500).json({error: "oops something went wrong!!.."})
    }
}

const updateNumberUser = async (req, res) =>{
    try {
        const _id = req.params.id;
        const {number} = req.body;

        if(!number.trim()){
            return res.status(422).json({error : "Plz fill the field"});
        }
        // console.log("after inside")
        const UserExist = await User.findOne({number});
        // console.log("after fetching", UserExist);
        if( UserExist ){
            // console.log("Number already exist")
            return res.status(409).json({error : "Number already exist"});
        }
        const updateEmail = await User.findByIdAndUpdate( _id, {number},{
            new : true
        });
        res.status(201).json({ message: "number updated successfully" });
        // console.log("number Updated successfully")
    } catch (err) {
        // console.log(err);
        res.status(500).json({error: "oops something went wrong!!.."})
    }
}

const UpdatePasswordUser = async (req, res) =>{
    try {
        const _id = req.params.id;
        const {password, curr_password} = req.body;
        // console.log("from the req.body",password,curr_password)
        const updatePassword = await User.findById(_id)
        // console.log("inside the update password", updatePassword)
        if(updatePassword){
            // console.log("entered the if condition",curr_password, updatePassword.password);
            const isMatch = await bcrypt.compare(curr_password, updatePassword.password);
            // console.log("inside the updatePassword ")
            if(!isMatch){
                // console.log("couldn't match");
                res.status(400).json({ error : "current password wont match"});
            } else {
                // console.log("password matched")
                updatePassword.password = password
                updatePassword.save(); 
                res.status(201).json({ message: "password updated successfully" });
                // console.log("password Updated successfully");
            }
        }else{
            res.status(400).json({ error : "Invalid Credential"}); 
        }
    } catch (err) {
        // console.log(err);
        res.status(500).json({error: "oops something went wrong!!.."})
    }
}

const getUser = async (req, res) => res.send(req.rootUser);

const deleteUserAccount = async (req, res) =>{
    try{

        const _id = req.params.id;
        const User_ID = _id;
        const {passDel} = req.body
        let password = passDel

        const UserLog = await User.findById(_id);
        
        const isMatch = await bcrypt.compare(password, UserLog.password);

        if(isMatch){  
    
            // const catID = await AITools.findOne({UID: User_ID},{CategoryID:1})
            // await Categories.findByIdAndDelete({_id: catID})
            // await AITools.deleteMany({UID: User_ID})

            res.clearCookie("jwt", {path:'/'});
            await User.findByIdAndDelete(_id)
    
            res.status(201).json({ message: "Account is deleted successfully" });
            // console.log("Account is deleted successfully")
        }else{
            // console.log("password do not match")
            res.status(400).json({ error : "Invalid Credential"});
        }

    }catch(err){
        // console.log(err);
        res.status(500).json({error: "oops something went wrong!!.."})
    }
}




module.exports = {registerUser, signInUser, logOutUser, 
    LoutOutAllDevicesUser, updateEmailUser, updateNumberUser, 
    UpdatePasswordUser, getUser, deleteUserAccount}