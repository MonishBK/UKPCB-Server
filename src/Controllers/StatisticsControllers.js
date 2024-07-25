const Complaints = require('../models/ComplaintsSchema');
const Enquiries = require('../models/EnquiriesSchema');
const File = require('../models/FileSchema');
const Marquee = require('../models/MarqueeSchema');
const Media = require('../models/MediaSchema');
const Banner = require('../models/BannerSchema');

const moment = require('moment');

const Statistics = async (req, res) =>{
    try {
        // Total files uploaded
        const totalFiles = await File.countDocuments();

        // Total PDF files uploaded
        const totalPdfFiles = await File.countDocuments({ 'data.type': 'PDF' });

        // Total Excel files uploaded
        const totalExcelFiles = await File.countDocuments({ 'data.type': 'Excel' });

        // Total events
        const totalEvents = await Media.countDocuments();

        // Total banners
        const totalBanners = await Banner.countDocuments();

        // Total marquee
        const totalMarquees = await Marquee.countDocuments();

        // Total complaints
        const totalComplaints = await Complaints.countDocuments();

        // Total today new complaints
        const today = moment().startOf('day');
        const totalTodayNewComplaints = await Complaints.countDocuments({
            createdAt: { $gte: today.toDate(), $lt: moment(today).endOf('day').toDate() }
        });

        // Total new complaints
        const totalNewComplaints = await Complaints.countDocuments({ status: 'new' });

        // Total in progress complaints
        const totalInProgressComplaints = await Complaints.countDocuments({ status: 'in_progress' });

        // Total resolved complaints
        const totalResolvedComplaints = await Complaints.countDocuments({ status: 'resolved' });

        // Total enquiries
        const totalEnquiries = await Enquiries.countDocuments();

        // Total today new enquiries
        const totalTodayNewEnquiries = await Enquiries.countDocuments({
            createdAt: { $gte: today.toDate(), $lt: moment(today).endOf('day').toDate() }
        });

        // Total new enquiries
        const totalNewEnquiries = await Enquiries.countDocuments({ status: 'new' });

        // Total in progress enquiries
        const totalInProgressEnquiries = await Enquiries.countDocuments({ status: 'in_progress' });

        // Total resolved enquiries
        const totalResolvedEnquiries = await Enquiries.countDocuments({ status: 'resolved' });

        res.json({
            totalFiles,
            totalPdfFiles,
            totalExcelFiles,
            totalEvents,
            totalBanners,
            totalMarquees,
            totalComplaints,
            totalTodayNewComplaints,
            totalNewComplaints,
            totalInProgressComplaints,
            totalResolvedComplaints,
            totalEnquiries,
            totalTodayNewEnquiries,
            totalNewEnquiries,
            totalInProgressEnquiries,
            totalResolvedEnquiries,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
        console.log(error)
    }
} 

module.exports = {Statistics}