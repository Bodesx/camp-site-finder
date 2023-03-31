const cloudinary = require('cloudinary').v2
const{CloudinaryStorage}=require('multer-storage-cloudinary')
const express = require('express');
const multer = require('multer');

cloudinary.config({
   cloud_name:process.env.cloud_Name, 
   api_key:process.env.api_Key,
   api_secret:process.env.api_Secret
})

const storage = new CloudinaryStorage({
   cloudinary,
  params: {
    folder: 'Camp',
    allowedFormat: ['png', 'jpeg',  'jpg']    // supports promises as well
  }   
});

module.exports={cloudinary,storage}