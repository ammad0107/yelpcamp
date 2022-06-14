
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');




mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })



const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
console.log(sample(descriptors));

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        let price = Math.floor(Math.random() * 100);
        const rand1000 = Math.floor(Math.random() * 1000);
        const c = new Campground({
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, repellendus molestiae numquam excepturi libero ad, amet quaerat esse debitis illo deserunt est eos, doloremque at facilis quos dicta porro nesciunt.',
            image: 'https://source.unsplash.com/collection/483251',
            price
        })
        await c.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})



