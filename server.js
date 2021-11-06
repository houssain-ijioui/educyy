if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride= require('method-override');
const GridFsStorage = require('multer-gridfs-storage');



require('./passport')(passport);

const authRouter = require('./routes/auth');
const routes = require('./routes/routes');
const multer = require('multer');

const app = express();


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyborad cat',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());


app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});






mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.log('Error' + err));

mongoose.set('useCreateIndex', true);



app.use('/', routes);
app.use('/auth', authRouter);



app.listen(process.env.PORT || 3000);

