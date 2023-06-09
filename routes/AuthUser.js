const express=require('express')
const router=express.Router()
const User=require('../models/user')
const catchAsync = require('../utilities/catchAsync');
const passport=require('passport')
const Ath =require('../controllers/AuthUser')

router.get('/register', Ath.userRegister)

router.post('/register', catchAsync (Ath.register))

router.get('/login', Ath.userLogin)

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), Ath.userAuth )

router.get('/logout', Ath.userLogout)

module.exports = router