const { func } = require('joi');
const mongoose = require('mongoose');
const { campgroundSchema } = require('../schema');
const reviews = require('./reviews');
const Schema = mongoose.Schema;
// const Product = require('./models/product');

const CampgroundSchema = new Schema({

    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

})


CampgroundSchema.post('findOneAndDelete', async function (data) {
    if (data) {
        await reviews.deleteMany({ _id: { $in: data.reviews } })
    }
})




module.exports = mongoose.model('Campground', CampgroundSchema);




// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"))
// db.once("open", () => {
//     console.log("databse connected")
// });


