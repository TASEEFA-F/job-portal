const express = require('express');
const router = express.Router();
const Job = require('../models/job.model');

// Welcome Page Route
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ postedDate: -1 }).limit(5); // Get 5 latest jobs
        res.render('index', { jobs: jobs });
    } catch (err) {
        res.send('Error loading jobs');
    }
});
module.exports = router;