const mongoose = require("mongoose");
const Campground = require("../models/campground");
// seed text files
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

// launches connection to db
mongoose.connect("mongodb://localhost:27017/yelp-camp");

// checks for connection errors
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// pass in an array, returns random element from that array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// sample description
const description =
  "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus commodi repudiandae perferendis molestiae autem minima ut corrupti nihil, magni eius et odit exercitationem repellat! Reiciendis debitis illum sed repellat ex!";

// populates collection
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand = Math.floor(Math.random() * 1000); // inside portion gets us random number, floor gets us an int
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[rand].city}, ${cities[rand].state}`,
      title: `${sample(descriptors)} ${sample(places)} `,
      image: `https://source.unsplash.com/random/300x300?camping,${i}`,
      description,
      price,
    });
    await camp.save();
  }
};

//closes connection
seedDB().then(() => {
  mongoose.connection.close();
});
