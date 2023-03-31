const express=require('express')
const router=express.Router()
const catchAsync=require('../utilities/catchAsync')
const campground=require('../controllers/campground')
const Campground=require('../models/campgrounds')
const {loggedIn, isAuthor,validateCampground}=require('../middlewares/middleware')
const multer  = require('multer')
const {storage}=require('../cloudinary/index')
const upload = multer({storage})


//home page
router.get('/home', catchAsync(campground.home))

//campground New
router.get('/new',  loggedIn,(campground.NewForm))

//campground index
router.get('/', catchAsync(campground.index))


//show page
router.get('/:id', catchAsync(campground.Show)) 

//create campground
router.post('/', loggedIn,  upload.array('image'),  catchAsync(campground.CreateCampground))


//edit campground
router.get('/:id/edit',loggedIn, isAuthor, catchAsync(campground.Edit))

//update page
router.put('/:id', loggedIn, isAuthor, upload.array('image'),  catchAsync(campground.Update));

//delete page
router.delete('/:id', loggedIn,isAuthor, catchAsync(campground.Delete))


 //validateCampground,





    















module.exports = router;