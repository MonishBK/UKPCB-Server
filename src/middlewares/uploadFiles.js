const multer = require('multer');
const path = require('path');


const validExtensions = {
    Excel: ['xlsx', 'xls', 'csv'],
    PDF: ['pdf'],
    Photo: ['jpg', 'jpeg', 'png'],
    Video: ['mp4', 'avi', 'mov']
  };
  
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
  
        // console.log("type =>", fileType);
  
        if (fileType) {
            cb(null, path.join(__dirname, '../..', 'public', 'assets', fileType)); // Store in the appropriate directory
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
    limits: { fileSize: 1000000 }
  });


  const uploadFiles = async (req, res) => {
    try {
        const uploadedFiles = req.files;
        
        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }
  
        console.log("Files Uploaded successfully:", uploadedFiles); 
        res.status(201).json({ data: uploadedFiles });
    } catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops something went wrong!!' });
    }
  }


  module.exports = {upload, uploadFiles, validExtensions};