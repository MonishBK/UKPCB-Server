const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');



const validExtensions = {
    Excel: ['xlsx', 'xls', 'csv'],
    PDF: ['pdf'],
    Photo: ['jpg', 'jpeg', 'png'],
    Video: ['mp4', 'avi', 'mov']
  };

// multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        let fileType = null;
  
      // Find the file type based on the extension
      for (const [type, extensions] of Object.entries(validExtensions)) {
        if (extensions.includes(fileExtension)) {
          fileType = type;
          break;
        }
      }

      console.log("type =>", fileType)
  
      if (fileType) {
        cb(null, path.join(__dirname, '..', 'public', 'assets', fileType)); // Store in the appropriate directory
      } else {
        cb(new Error('Invalid file type'), false);
      }
    },
    filename: function(req, file, cb) {
      cb(null, `FILE-` + Date.now() + path.extname(file.originalname));
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
router.post('/update/pdf-file', async (req, res) => {
    try {
      const { newPDF, category } = req.body;
  
      // Check if newPDF contains a promise or unresolved asynchronous data
      if (typeof newPDF === 'object' && newPDF.then) {
        // Resolve the promise if it exists
        newPDF = await newPDF;
        // console.log(newPDF);
    }
    
    console.log("pdf=> ",newPDF);
      console.log(typeof newPDF === 'object' && newPDF.then)
  
      // Read the existing data from the file
      const fileData = fs.readFileSync(path.join(__dirname, '..', 'JsonFiles', 'PDFjson.json'), 'utf-8');
      const jsonData = JSON.parse(fileData);
  
      // Apply your updates to the data
      jsonData[category].unshift(newPDF);
  
      // Write the updated data back to the file
      fs.writeFileSync(path.join(__dirname, '..', 'JsonFiles', 'PDFjson.json'), JSON.stringify(jsonData, null, 2));
  
      // Log a message to confirm that the file has been updated
      console.log('File updated successfully');
      res.status(201).json({ message: 'success!!' });
  
    } catch (err) {
      console.log(err);
      res.status(422).json({ error: err.message });
    }
  });



module.exports = router;