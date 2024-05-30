const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');



// multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'assets')); // Corrected path
    },
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
 });
 
 const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
 })


// Upload the files
router.post('/upload/e-files',upload.single("file"), async (req, res) =>{

    try{
        const Uploaded_File = req.file
        // console.log(Uploaded_File)
        // console.log("checking",_id)
        // console.log("from auth ->",_id)

        // console.log(UserUpdate);
        // console.log("File Uploaded successful")
        res.status(201).json({ data: Uploaded_File });

    }catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong!!' });
    }


}
);

// Update the JSON file
router.post('/update/pdf-file', async (req, res) =>{

    try{
        const { newPDF, category } = req.body
        // Read the existing data from the file
        const fileData = fs.readFileSync(path.join(__dirname, '..', 'JsonFiles', 'PDFjson.json'), 'utf-8');
        const jsonData = JSON.parse(fileData);

        
                // console.log("check=>",newPDF, category)
        // Apply your updates to the data
        jsonData[category].push(newPDF);

        // Write the updated data back to the file
        fs.writeFileSync(path.join(__dirname, '..', 'JsonFiles', 'PDFjson.json'), JSON.stringify(jsonData, null, 2));

        // Optionally, log a message to confirm that the file has been updated
        // console.log('File updated successfully');
        res.status(201).json({ message:'success!!' });

    }catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong!!' });
    }


}
);



module.exports = router;