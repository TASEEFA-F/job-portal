const mongoose = require('mongoose');
const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'Applied' },
    applicationDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Application', ApplicationSchema);