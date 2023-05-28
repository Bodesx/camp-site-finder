if(process.env.NODE_ENV !=="production"){
require('dotenv').config()
}
const express= require('express');
const app= express();
const mongoose=require('mongoose');
const engine =require('ejs-mate')
const catchAsync=require('./utilities/catchAsync')
const ExpressError=require('./utilities/ExpressError')
const{campgroundSchema,reviewSchema}=require('./Schemas.js')
const Override=require('method-override');
const session=require('express-session')
const path= require('path');
const flash=require('connect-flash')
const Campground=require('./models/campgrounds')
const Review=require('./models/review')
const campgroundRoute= require('./routes/campground')
const reviewsRoute=require('./routes/reviews');
const userRoute=require('./routes/AuthUser')
const { Cookie } = require('express-session');
const passport = require('passport');
const localPass=require('passport-local')
const User=require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');



mongoose.connect('mongodb://localhost:27017/camping',{useNewUrlParser: true,  useUnifiedTopology: true, });
const db= mongoose.connection
db.on('error',console.error.bind (console, 'connection error'));
db.once('open',() =>{
    console.log('db connection open')
})

app.engine('ejs',engine)
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'))   
app.use(express.urlencoded({extended:true}))
//method override for changing post to put delete etc
app.use(Override('_method'))
app.use(express.static(path.join(__dirname,'public'))) 
app.use(mongoSanitize())

//session middleware
const sessionConfig={
    name:'camp',
    secret:'Top-secret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true, 
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
    }

}


app.use(flash())
app.use(session(sessionConfig))




//use passport b4 session
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localPass(User.authenticate()))

//store user and delete 
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



//use flash with session must be last b4 route cos it breaks things a-lot
app.use((req, res, next)=>{
    //used loggedUser instead of currentUser the ejs in show in yelp camp is current user mine is logged user
    res.locals.loggedUser=req.user
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next();
})

//route handlers for campground and review
app.use('/', userRoute)
app.use('/campgrounds', campgroundRoute)
app.use('/campgrounds/:id/reviews', reviewsRoute)



app.get('/', (req,res) => {
    res.render ('home');
})






app.all('*',(req,res,next)=>{    
    next(new ExpressError('page not found',404))
  res.send("404!!!")  
})

app.use ((err,req,res,next)=>{
    const{statusCode=500,message='something went wrong'}=err;
    if(!err.message)err.message='oh no'
    res.status(statusCode).render('error',{err})
    
})







app.listen (8080, () =>{
    console.log('we ar liv')
})



