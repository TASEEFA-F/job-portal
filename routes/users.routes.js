const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user.model');

// Login Page
router.get('/login', (req, res) => res.render('login', { error: null }));

// Register Page
router.get('/register', (req, res) => res.render('register', { errors: [] }));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2, role } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2 || !role) errors.push({ msg: 'Please fill in all fields' });
    if (password !== password2) errors.push({ msg: 'Passwords do not match' });
    if (password.length < 6) errors.push({ msg: 'Password should be at least 6 characters' });

    if (errors.length > 0) {
        return res.render('register', { errors, name, email, password, password2, role });
    }
    
    User.findOne({ email: email.toLowerCase() }).then(user => {
        if (user) {
            errors.push({ msg: 'Email is already registered' });
            return res.render('register', { errors, name, email, password, password2, role });
        }
        
        const newUser = new User({ name, email: email.toLowerCase(), password, role });
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save().then(user => res.redirect('/users/login'));
            })
        );
    });
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.render('login', { error: info.message });
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/jobs');
        });
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/users/login');
    });
});
module.exports = router;