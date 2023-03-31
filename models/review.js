const mongoose = require('mongoose');
const Schema=mongoose.Schema


const reviewSchema=new Schema({
    body:String,
    rating:String,
    author:{
type: Schema.Types.ObjectId,
ref:'user'
    },
   
});
  
module.exports = mongoose.model('Review', reviewSchema)