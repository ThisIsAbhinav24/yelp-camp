const express=require('express');
const router=express.Router({mergeParams:true});

const Campground = require('../models/campground');
const Review=require("../models/review");

const{validateReview,isLoggedIn,isReviewAuthor}=require("../middleware");

const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');

const reviews=require('../controller/reviews')


router.route('/')
      .post(isLoggedIn,validateReview,catchAsync(reviews.createReview))
   
router.route("/:reviewId")
      .delete(isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports=router;