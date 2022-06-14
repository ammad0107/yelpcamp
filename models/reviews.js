const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Product = require('./models/product');

const reviewSchema = new Schema({

    body: String,
    rating: Number

})

module.exports = mongoose.model('Review', reviewSchema);