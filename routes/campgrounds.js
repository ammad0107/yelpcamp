const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressErrors');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schema.js');
const Joi = require('joi');

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    console.log("my", error)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        console.log('mesage is', msg)
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}



router.get('/', wrapAsync(async (req, res, next) => {     //all campground display
    try {
        const campground = await Campground.find({});
        res.render('campgrounds/index', { campground })
    }
    catch (error) {
        next(error);
    }
}))



router.get('/new', (req, res) => { // rpute that open add new campground form
    res.render('campgrounds/new')
})



router.post('/', wrapAsync(async (req, res, next) => {      //route that save new campground form data


    const campground = new Campground(req.body);
    await campground.save();
    const id = (campground._id);
    req.flash('success', 'Successfully made a new Campground!')
    res.redirect(`/campgrounds/${id}`)

}))

// router.post('/', wrapAsync(async (req, res, next) => {      //route that save new campground form data

//     const campground = new Campground(req.body);

//     await campground.save();
//     const id = (campground._id);
//     // console.log(id)
//     res.redirect(`/campgrounds/${id}`)


// }))


router.get('/:id', wrapAsync(async (req, res, next) => {    //route that shows detail of campground
    try {

        const { id } = req.params;
        const campground = await Campground.findById(id).populate('reviews');
        if (!campground) {
            req.flash('error', 'Campground not found!')
            return res.redirect(`/campgrounds`)
        }
        // console.log(success)
        //  const campground = await Campground.find({});
        res.render('campgrounds/show', { campground })
    }
    catch (error) {
        next(error);

    }
}))


router.get('/:id/edit', wrapAsync(async (req, res, next) => {       //route that open edit form

    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        return req.flash('error', 'Campground not found!')
        res.redirect(`/campgrounds`)
    }

  
    

    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', wrapAsync(async (req, res, next) => {


    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body }, { new: true })
    if (!campground) {
        req.flash('error', 'Campground not found!')
        return res.redirect(`/campgrounds`)
    }
    req.flash('success', 'Successfully Updated new Campground!')
    res.redirect(`/campgrounds/${id}`)

}))



router.delete('/:id', wrapAsync(async (req, res, next) => {
    try {

        const { id } = req.params;
        const campground = await Campground.findByIdAndDelete(id, { runValidators: true });
        req.flash('success', 'Successfully deleted campground')
        res.redirect('/campgrounds');
    }
    catch (error) {
        next(error)
    }

}));

module.exports = router;