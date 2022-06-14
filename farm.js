
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/qwe', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
});

const productSchema = new mongoose.Schema({

    name: String,
    price: Number,
    season: {
        type: String,
        enum: ['Summer', 'Winter', 'Spring', 'Fall']

    }

});
const Product = mongoose.model('Product', 'productSchema');
Product.insertMany([{ name: 'water melon', price: 34, season: 'Summer' },
{ name: 'Pear', price: 14, season: 'Spring' },
{ name: 'lemon', price: 34, season: 'Spring' },
])
