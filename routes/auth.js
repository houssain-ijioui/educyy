const router = require('express').Router();
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');


const User = require('../models/User');





// Login
router.get('/login', async (req, res) => {
    res.render('auth/login');
})



router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/auth/login',
        failureFlash: true,
    })(req, res, next)
})




// Register
router.get('/register', async (req, res) => {
    res.render('auth/register');
})



router.post('/register', (req, res) => {
    const { fullName, email, password1, password2 } = req.body;

    let errors = [];

    if (!fullName || !email || !password1 || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (password1 !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password1.length < 6) {
        errors.push({ msg: 'Passwords should be at lesat 6 characters' });
    }


    if (errors.length > 0) {
        res.render('auth/register', {
            errors,
            fullName,
            email, 
            password1,
            password2
        });
    } else {
        User.findOne({ email: email })
           .then(user => {
               if (user) {
                   errors.push({ msg: 'Email already Exists' });
                   res.render('auth/register', {
                       errors,
                       fullName,
                       email,
                       password1,
                       password2
                   });
               } else {
                   const newUser = new User({
                       fullName,
                       email,
                       password: password1
                   });
                   bcrypt.genSalt(11, (err, salt) => 
                       bcrypt.hash(newUser.password, salt, (err, hash) => {
                           if (err) throw err;

                           newUser.password = hash;

                           newUser.save()
                             .then(user => {
                                req.flash('success_msg', 'You are now registered');
                                res.redirect('/auth/login');
                             })
                             .catch(err => console.log(err));
                       }))
               }
           })
    }
})


// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
})



module.exports = router;