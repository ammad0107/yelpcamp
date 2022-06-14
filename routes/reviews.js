
const express = require('express');
const router = express.Router({ mergeParams: true });
const Reviews = require('../models/reviews');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressErrors');
const { reviewSchema } = require('../schema.js');

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}


const validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        console.log('mesage is', msg)
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}



router.delete('/:reviewId', wrapAsync(async (req, res, next) => {    //route that shows detail of campground
    try {

        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Reviews.findByIdAndDelete(reviewId);
        req.flash('success', 'Successfully deleted Review!')
        res.redirect(`/campgrounds/${id}`);

    }
    catch (error) {
        next(error);

    }
}))



router.post('/', validateReview, wrapAsync(async (req, res) => {    //route that shows detail of campground

    const campground = await Campground.findById(req.params.id);
    const review = new Reviews(req.body);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully Added Review!')
    res.redirect(`/campgrounds/${campground._id}`)

}))

module.exports = router;