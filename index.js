const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const path = require('path');


dotenv.config({path:"./config.env"}); 
const PORT = process.env.PORT || 5000 ;
 
require('./src/db/conn');

// to read json file we use this middle ware
app.use(express.json());


const corsOptions = {
        origin: ["https://uk-pollution-control-board.vercel.app","http://localhost:5173"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, // If using cookies or authentication

        // origin: (origin, callback) => {
        //     const allowedDomains = [
        //         "https://uk-pollution-control-board.vercel.app",
        //         "http://localhost:5173"
        //     ];
    
        //     // Allow all subdomains of vercel.app
        //     const isAllowedDomain = allowedDomains.some(domain => origin && origin.startsWith(domain)) ||
        //         (origin && /https:\/\/.*\.vercel\.app/.test(origin)); // Regex to match all Vercel subdomains
    
        //     if (isAllowedDomain) {
        //         callback(null, true);
        //     } else {
        //         callback(new Error('Not allowed by CORS'));
        //     }
        // },

        // origin: (origin, callback) => {
        //     callback(null, true); // Allow all origins temporarily for debugging
        // },
        // methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        // credentials: true

  };
  
app.use(cors(corsOptions)); 

// Explicitly set headers manually (important)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });
  
  // Handle Preflight Requests
  app.options("*", (req, res) => {
    res.sendStatus(204);
  });

app.use(cookieParser()); 

//linking the router files to make our route easily 
app.use("/api/user",require('./src/Routes/userRoutes'));
app.use("/api/menus",require('./src/Routes/menuRoutes'));
app.use("/api/filesUpload",require('./src/Routes/fileRoutes'));
app.use("/api/notifications",require('./src/Routes/notificationRoutes'));
app.use("/api/recent-update",require('./src/Routes/recentUpdateRoutes'));
app.use("/api/enquiries",require('./src/Routes/enquiriesRoutes'));
app.use("/api/complaints",require('./src/Routes/complaintsRoutes'));
app.use("/api/media",require('./src/Routes/mediaRoutes'));
app.use("/api/banner",require('./src/Routes/bannerRoutes'));
app.use("/api/marquee",require('./src/Routes/marqueeRoutes'));
app.use("/api/statistics",require('./src/Routes/statisticsRoutes'));


app.get('/', (req, res) =>{
    res.send("Hello world from the server");
});
 
// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/pdf-data', express.static(path.join(__dirname, 'JsonFiles')));

app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`) 
})