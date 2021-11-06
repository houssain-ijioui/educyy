const router = require('express').Router();
const mongoose = require('mongoose');


const User = require('../models/User');


// index
router.get('/', async (req, res) => {
    res.render('index', { isAuth: req.isAuthenticated()});
})


// Search 
router.post('/search', (req, res) => {
    const name = req.body.searchQuery;
    User.find({ fullName: { $regex: `${name}`, $options: 'i' } }, (err, users) => {
        if (err) {
            console.log(err);
        } else {
            res.render('search', { isAuth: req.isAuthenticated(), name: name, users: users })
        }
    })
})


// Profile 
router.get('/profile', (req, res) => {
    res.render('profile', { isAuth: req.isAuthenticated() });
})



// Upload File
router.get('/new', (req, res) => {
    res.render('new', { isAuth: req.isAuthenticated() });
})


router.post('/new', (req, res) =>{
    console.log(req.body);
    res.redirect('/new')
})


// Update Profile
router.get('/update-account', (req, res) => {
    res.render('update-account', { isAuth: req.isAuthenticated() });
})

module.exports = router;