const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methorOverride = require("method-override");
const ejsMate = require("ejs-mate");
const joi = require("joi");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

const Campground = require("./models/campground");
const { campgroundSchema } = require("./schemas.js");
const { urlencoded } = require("express");
const Joi = require("joi");
const { join } = require("path");

// launches connection to db
mongoose.connect("mongodb://localhost:27017/yelp-camp");
// checks for connection errors
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// sets ejs-mate as engine to parse EJS instead of default
app.engine("ejs", ejsMate);
// allows ejs to work through render
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// used to parse request body into json
app.use(express.urlencoded({ extended: true }));
// allows us to use put requuest from form
app.use(methorOverride("_method"));

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = errorDetails.map((el) => el.message.join(","));
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", async (req, res) => {
  res.render("home");
});

// index route (all campgrounds)
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// serves form for new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// show route (details for one campground)
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

// creates new campground and redirects to new campground
app.post(
  "/campgrounds",
  validateCamprgrounds,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground); // grouping allowed by using campground[property] as name
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// serves form to edit campground
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

// updates campground and redirects to show page
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground, // spread operator
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err; //default value
  if (!err.message) err.message = "Oh no something went wrong"; //default message
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
