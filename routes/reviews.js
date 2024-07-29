const express=require('express');
const router=express.Router({mergeParams:true});

const Campground = require('../models/campground');
const Review=require("../models/review");

const{validateReview,isLoggedIn,isReviewAuthor}=require("../middleware");

const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');



router.post("/",isLoggedIn,validateReview,catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
       const review= new Review(req.body.reviews); 
       review.author=req.user._id; 
       campground.reviews.push(review);
       await review.save();
       await campground.save();
       req.flash('success',"Successfully made new review")
       res.redirect(`/campgrounds/${campground._id}`)
   
   }))
   
   router.delete("/:reviewId",isLoggedIn,isReviewAuthor,catchAsync(async(req,res)=>{
       const camp=await Campground.findByIdAndUpdate(req.params.id,{$pull: {reviews: req.params.reviewId}});
       await Review.findByIdAndDelete(req.params.reviewId);
       req.flash('success',"Deleted the review")
       res.redirect(`/campgrounds/${req.params.id}`);
   }))

   module.exports=router;