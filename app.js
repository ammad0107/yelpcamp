const express = require("express"); //include express
const mongoose = require('mongoose');  // include mongoose

const path = require('path');        // used to give correct path
const flash = require('connect-flash');

const ejsMate = require('ejs-mate');   // used for embedded javascript, (using ejs not react)

const User=require('./models/user');
const passport=require('passport')
const LocalStrategy=require('passport-local')

const campgrounds = require('./routes/campgrounds');   // routes file campground
const reviews = require('./routes/reviews');          // routes fle reviews
const ExpressError = require('./utils/ExpressErrors');   // express error 








mongoose.connect('mongodb://0.0.0.0:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
});



const app = express();


const Joi = require('joi');            // client side validation
const req = require("express/lib/request");    //
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

var methodOverride = require('method-override')   //over riding patch or delete methods
app.use(methodOverride('_method'));

const session = require('express-session');       // setting session
const user = require("./models/user");
const sessionConfig =
{
    secret: 'thisshouldbebettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
//hey there
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session(sessionConfig))         // setting session

// setting flash messages
app.use(flash());
app.use(passport.session());
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)



app.get('/', async (req, res) => {
    res.render('home')
})




app.all('*', function (req, res, next) {

    next(new ExpressError('Page not found', 404))
})


app.use(function (err, req, res, next) {

    // console.log("code is", err.statusCode)
    const { statusCode = 500 } = err;
    // console.log("code is", statusCode)
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err });
    // res.send('something went wrong')
})


app.listen(3000, function () {
    console.log("listening to request") // start the server
});
