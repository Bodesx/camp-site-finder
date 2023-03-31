const express=require('express')
const router=express.Router({mergeParams: true})
const catchAsync=require('../utilities/catchAsync')
const ExpressError=require('../utilities/ExpressError')
const{reviewSchema}=require('../Schemas')
const{validateReview,loggedIn, reviewAuthor }=require('../middlewares/middleware')
const reviews=require('../controllers/review')
const Review=require('../models/review')



 router.post('/', loggedIn, validateReview,  catchAsync(reviews.CreateReview))

 router.delete('/:reviewId', loggedIn, reviewAuthor,  catchAsync(reviews.DeleteReview))




 module.exports =router