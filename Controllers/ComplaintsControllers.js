const Complaints = require('../models/ComplaintsSchema')

const addComplaints = async (req, res) => {
    try {
        const { subject, Name, Email, Phone } = req.body;

        const data = new Complaints({ subject, Name, Email, Phone });
        await data.save()
        res.status(201).json({ message: "Added successfully" });

    } catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong' });
    }
};

const updateComplaintsSeen = async (req, res) => {
    try {
        const { _id, Seen_date } = req.body;

        const data = await Complaints.findByIdAndUpdate(_id, { Seen_date }, {new: true});
        res.status(201).json({ message: "successfully" });

    } catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong' });
    }
};

const updateComplaintsRespondedDate = async (req, res) => {
    try {
        const { _id, Responded_date } = req.body;

        const data = await Complaints.findByIdAndUpdate(_id, { Responded_date }, {new: true});
        res.status(201).json({ message: "successfully" });

    } catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong' });
    }
};

const deleteComplaints = async (req, res) => {
    try {
        const { _id } = req.body;

        await Complaints.findByIdAndDelete(_id);
        res.status(201).json({ message: "successfully" });

    } catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong' });
    }
};

const ViewComplaints = async (req, res) => {
    try {

        const data = await Complaints.find();
        res.status(200).json({ data });

    } catch (err) {
        console.log(err);
        res.status(422).json({ error: 'Oops some thing went wrong' });
    }
};

module.exports = { addComplaints, updateComplaintsSeen, updateComplaintsRespondedDate, deleteComplaints, ViewComplaints }