const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    postedDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Job', JobSchema);