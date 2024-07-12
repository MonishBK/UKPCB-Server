const dotenv = require("dotenv");
const express = require("express");
const app = express();
// const cors = require('cors');
const cookieParser = require("cookie-parser");
const path = require('path');


dotenv.config({path:"./config.env"}); 
const PORT = process.env.PORT || 5000 ;
 
require('./src/db/conn');

// to read json file we use this middle ware
app.use(express.json());


const corsOptions = {
        origin: "https://uk-pollution-control-board.vercel.app",
        // origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true
  };
  
// app.use(cors(corsOptions)); 

app.use(cookieParser()); 

//linking the router files to make our route easily 
app.use("/api/user",require('./src/Routes/userRoutes'));
app.use("/api/menus",require('./src/Routes/menuRoutes'));
app.use("/api/filesUpload",require('./src/Routes/fileRoutes'));
app.use("/api/notifications",require('./src/Routes/notificationRoutes'));
app.use("/api/enquiries",require('./src/Routes/enquiriesRoutes'));
app.use("/api/complaints",require('./src/Routes/complaintsRoutes'));
app.use("/api/media",require('./src/Routes/mediaRoutes'));
app.use("/api/banner",require('./src/Routes/bannerRoutes'));


app.get('/', (req, res) =>{
    res.send("Hello world from the server");
});
 
// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/pdf-data', express.static(path.join(__dirname, 'JsonFiles')));

app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`) 
})