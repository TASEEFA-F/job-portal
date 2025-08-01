const express = require('express');
const router = express.Router();
const Job = require('../models/job.model');

// Middleware to protect routes
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/users/login');
};

// All Jobs Page
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ postedDate: -1 });
        res.render('jobs', { jobs: jobs });
    } catch (err) {
        res.send('Error loading jobs');
    }
});

// Post Job Page
router.get('/post', ensureAuthenticated, (req, res) => {
    if (req.user.role !== 'Employer') return res.redirect('/jobs');
    res.render('post-job', { errors: [] });
});

// Post Job Handle
router.post('/post', ensureAuthenticated, (req, res) => {
    const { title, company, location, description } = req.body;
    if (req.user.role !== 'Employer') return res.redirect('/jobs');
    if (!title || !company || !location || !description) {
        return res.render('post-job', { errors: [{ msg: 'Please fill in all fields' }] });
    }
    const newJob = new Job({ title, company, location, description, postedBy: req.user.id });
    newJob.save().then(job => res.redirect('/jobs'));
});
module.exports = router;