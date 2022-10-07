const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const Campground = require("./models/campground");

// launches connection to db
mongoose.connect("mongodb://localhost:27017/yelp-camp");
// checks for connection errors
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// allows ejs to work through render
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(3000, () => {
  console.log("Serving on port 3000");
});

// index route (all campgrounds)
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// show route (details for one campground)
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});
