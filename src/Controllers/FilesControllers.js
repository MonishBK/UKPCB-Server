const File = require('../models/FileSchema')
const fs = require('fs/promises'); // Using promises-based fs module
const path = require('path');
const {validExtensions} = require('../middlewares/uploadFiles')


const addFiles = async (req, res) => {
    const uploadedFiles = req.file;
    
    try {
        
        if(uploadedFiles){
            const { filePath, name } = req.body;
            
            const fileExtension = uploadedFiles.originalname.split('.').pop().toLowerCase();
                let fileType = null;
          
                // Find the file type based on the extension
                for (const [type, extensions] of Object.entries(validExtensions)) {
                    if (extensions.includes(fileExtension)) {
                        fileType = type;
                        break;
                    }
                }
    
                const fileFormat = {
                    name: name,
                    href:`/assets/${fileType}/${uploadedFiles.filename}`,
                    type: fileType
                }
    

                // Find the existing document by path
                let pathExist = await File.findOne({ path: filePath });
        
                if (!pathExist) {
                    // Create a new document if the path does not exist
                    pathExist = new File({ path: filePath, data: [] });
                }
        
                
        
                // Append the new data to the existing data array
                pathExist.data.push(fileFormat);
        
                // Save the updated or new document
                await pathExist.save();
        
                res.status(201).json({ message: 'Success!!' });
        }else{
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

    } catch (err) {
        console.log(err);
        fs.unlink(uploadedFiles.path)
        res.status(500).json({ error: 'Oops some thing went wrong' });
    }
};


const deleteFile = async (req, res) => {
    try {
        const { filePath, href } = req.body;

        console.log(filePath, href )

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
        const serverFilePath = path.join(__dirname, '../..', 'public', 'assets', fileToRemove.type, path.basename(fileToRemove.href));
        await fs.unlink(serverFilePath);

        // Remove the file from the data array in MongoDB
        fileDoc.data = fileDoc.data.filter(file => file.href !== href);

        // Save the updated document
        await fileDoc.save();

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};


const ViewFiles = async (req, res) => {
    try {
      const { path, name, startDate, endDate } = req.query; // Assuming path, name, startDate, endDate are passed as query parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      // Define filters based on query parameters
      const filters = {};
  
      // Add filter by path if provided
      if (path) {
        filters.path = { $in: path.split(",") }; // Handle multiple paths
      }
  
      // Add filter by name if provided
      if (name) {
        filters["data.name"] = { $regex: new RegExp(name, "i") }; // Case-insensitive search
      }
  
      // Add date range filter if startDate and/or endDate are provided
      if (startDate || endDate) {
        filters["data.createdAt"] = {};
        if (startDate) {
          filters["data.createdAt"].$gte = new Date(startDate);
        }
        if (endDate) {
          filters["data.createdAt"].$lte = new Date(endDate);
        }
      }
  
      // Aggregate query
      const aggregatePipeline = [
        { $unwind: "$data" },
        { $match: filters },
        { $sort: { "data.createdAt": -1 } }, // Sort by createdAt in descending order
        { $skip: skip },
        { $limit: limit },
        {
          $group: {
            _id: "$path", // Group by path
            data: { $push: "$data" },
          },
        },
        {
          $project: {
            _id: 0,
            filePath: "$_id", // Rename _id to filePath for clarity
            data: 1,
          },
        },
      ];
  
      // If no parameters are provided, modify the aggregate pipeline to avoid empty $match stage
      if (!path && !name && !startDate && !endDate) {
        aggregatePipeline.splice(1, 1); // Remove the $match stage
      }
  
      // Find and sort the files by the 'createdAt' field in fileDataSchema, and apply pagination
      const data = await File.aggregate(aggregatePipeline);
  
      // Count total number of documents matching the filters
      const totalAggregatePipeline = [
        { $unwind: "$data" },
        { $match: filters },
        { $count: "total" },
      ];
  
      if (!path && !name && !startDate && !endDate) {
        totalAggregatePipeline.splice(1, 1); // Remove the $match stage
      }
  
      const total = await File.aggregate(totalAggregatePipeline);
  
      // Calculate pagination details
      const totalCount = total.length > 0 ? total[0].total : 0;
      const totalPages = Math.ceil(totalCount / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
  
      // Format response
      const formattedData = data.length > 0 ? {
        filePath: data[0].filePath,
        data: data[0].data,
      } : null;
  
      res.status(200).json({
        data: formattedData,
        pagination: {
          total: totalCount,
          totalPages,
          nextPage,
          hasNextPage,
          hasPreviousPage,
          limit,
        },
      });
    } catch (error) {
      console.error("Error in ViewFiles:", error);
      return res.status(500).json({ error: "Oops, something went wrong" });
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
//     res.status(500).json({ error: err.message });
//   }