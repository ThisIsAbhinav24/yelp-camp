const express=require('express');
const router=express.Router({mergeParams:true});

const Campground = require('../models/campground');
const Review=require("../models/review");

const {reviewSchema}=require('../schemas');

const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');


const validateReview=(req,res,next)=>{
    const {error}= reviewSchema.validate(req.body);
    if(error)
        {
         const msg= error.details.map(el=>el.message).join(',')
         throw new ExpressError(msg,404);
        }else next();
}

router.post("/",validateReview,catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
       const review= new Review(req.body.reviews);  
       campground.reviews.push(review);
       await review.save();
       await campground.save();
       res.redirect(`/campgrounds/${campground._id}`)
   
   }))
   
   router.delete("/:reviewId",catchAsync(async(req,res)=>{
       await Campground.findByIdAndUpdate(req.params.id,{$pull: {reviews: req.params.reviewId}});
       await Review.findByIdAndDelete(req.params.reviewId);
       res.redirect(`/campgrounds/${req.params.id}`);
   }))

   module.exports=router;