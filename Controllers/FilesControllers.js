const File = require('../models/FileSchema')
const fs = require('fs/promises'); // Using promises-based fs module
const path = require('path');


  const addFiles = async (req, res) => {
    try {
        // const uploadedFiles = req.files;
        
        // if (!uploadedFiles || uploadedFiles.length === 0) {
        //     return res.status(400).json({ error: 'No files were uploaded.' });
        // }
  
        // console.log("Files Uploaded successfully:", uploadedFiles); 

        // const { filePath, data } = req.body;

        // Find the existing document by path
        const pathExist = await File.findOne({ path: filePath });

        if (!pathExist) {
            return res.status(404).json({ error: "Path not exists" });
        }

        // Append the new data to the existing data array
        pathExist.data.push(...data);

        // Save the updated document
        await pathExist.save();

        res.status(201).json({ message: 'Success!!' });
    } catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong' });
    }
};


const deleteFile = async (req, res) => {
    try {
        const { filePath, href } = req.body;

        // Find the document by path
        const fileDoc = await File.findOne({ path:filePath });

        if (!fileDoc) {
            return res.status(404).json({ error: "Path not exists" });
        }

        // Find the file to be removed
        const fileToRemove = fileDoc.data.find(file => file.href === href);

        if (!fileToRemove) {
            return res.status(404).json({ error: "File not found" });
        }

        // Delete the file from the server
        const serverFilePath = path.join(__dirname, '..', 'public', 'assets', fileToRemove.type, path.basename(fileToRemove.href));
        await fs.unlink(serverFilePath);

        // Remove the file from the data array in MongoDB
        fileDoc.data = fileDoc.data.filter(file => file.href !== href);

        // Save the updated document
        await fileDoc.save();

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(422).json({ error: err.message });
    }
};


const ViewFiles = async (req, res) => {
    try {
        // Find and sort the main menu items by the 'order' field
        const data = await File.find();

        res.status(200).json({ data });
    } catch (error) {
        return res.status(422).json({ error: "Oops, something went wrong" });
    }
};

  module.exports = {addFiles, deleteFile, ViewFiles}



//   try {
//     const { newPDF, category } = req.body;

//     // Check if newPDF contains a promise or unresolved asynchronous data
//     if (typeof newPDF === 'object' && newPDF.then) {
//       // Resolve the promise if it exists
//       newPDF = await newPDF;
//       // console.log(newPDF);
//   }
  
//   // console.log("pdf=> ",newPDF);
//     console.log(typeof newPDF === 'object' && newPDF.then)

//     // Read the existing data from the file
//     const fileData = fs.readFileSync(path.join(__dirname, '..', 'JsonFiles', 'PDFjson.json'), 'utf-8');
//     const jsonData = JSON.parse(fileData);

//     // Apply your updates to the data
//     jsonData[category].unshift(newPDF);

//     // Write the updated data back to the file
//     fs.writeFileSync(path.join(__dirname, '..', 'JsonFiles', 'PDFjson.json'), JSON.stringify(jsonData, null, 2));

//     // Log a message to confirm that the file has been updated
//     console.log('File updated successfully');
//     res.status(201).json({ message: 'success!!' });

//   } catch (err) {
//     console.log(err);
//     res.status(422).json({ error: err.message });
//   }