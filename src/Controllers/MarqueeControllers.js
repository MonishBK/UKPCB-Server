const Marquee = require('../models/MarqueeSchema');
const {validExtensions} = require('../middlewares/uploadFiles')

const createMarquee = async (req, res) => {
    try {
        const { marquee_title, custom_name } = req.body;
        let fileData = null;

        // Handle file upload
        if (req.file) {  // Use req.file if handling one file
            const file = req.file;
            const fileExtension = file.originalname.split('.').pop().toLowerCase();
            let fileType = null;

             // Find the file type based on the extension
             for (const [type, extensions] of Object.entries(validExtensions)) {
                if (extensions.includes(fileExtension)) {
                    fileType = type;
                    break;
                }
            }

            fileData = {
                name: custom_name,
                href: `/assets/${fileType}/${file.filename}`,
                type: fileType
            };
        }

        // Create new Marquee document
        const marquee = new Marquee({ marquee_title, file_data: fileData });
        await marquee.save();

        res.status(201).json({ message: "Marquee created successfully", data: marquee });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const getAllMarquees = async (req, res) => {
    try {
        const marquees = await Marquee.find().sort({ createdAt: -1 });
        res.status(200).json({ data: marquees });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const getMarqueeById = async (req, res) => {
    try {
        const marquee = await Marquee.findById(req.params.id);
        if (!marquee) {
            return res.status(404).json({ error: 'Marquee not found' });
        }
        res.status(200).json({ data: marquee });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const deleteMarquee = async (req, res) => {
    try {
        const marquee = await Marquee.findById(req.params.id);

        if (!marquee) {
            return res.status(404).json({ error: 'Marquee not found' });
        }

        // Delete associated files from the server
        marquee.file_data.forEach(file => {
            const filePath = path.join(__dirname, '../public/assets/marquee', path.basename(file.href));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        await Marquee.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Marquee deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = {createMarquee, getAllMarquees, getMarqueeById, deleteMarquee}