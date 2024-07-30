const express = require("express");
const router = express.Router();

const campgrounds = require("../controller/campgrounds");
const catchAsync = require("../utils/CatchAsync");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");

const { campgroundSchema } = require("../schemas");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");


router.route("/")
      .get(catchAsync(campgrounds.index))
      .post(isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground));

router.route('/new')
      .get(isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
      .get(catchAsync(campgrounds.showCampground))
      .put(isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.updateCampground))
      .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground));

router.route('/:id/edit')
      .get(isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));



module.exports = router;
 