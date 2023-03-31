const mongoose=require('mongoose');
const Schema= mongoose.Schema;
const Review=require('./review')

//image virtual nested in campground schema
const ImageSchema=new Schema({
url:String, filename:String
})

ImageSchema.virtual('thumbnail').get(function(){
 return this.url.replace('/upload','/upload/w_200')  
})
//end of image virtual

//virtuals to be part of hte result object
const opts={toJSON:{virtuals:true}}







const CampgroundSchema= new Schema({
    title:String,
    images:[ImageSchema],
    
    geometry:{ type:{type:String, enum:['Point'],required:true}, coordinates:{type:[Number],required:true}} ,

    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    reviews: [{
        type:Schema.Types.ObjectId,
        ref: 'Review'
    }]
    //pass the virtuals options 
},opts)  

//campground popup
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
 return `<strong><a href='/campgrounds/${this._id}'></a> ${this.title}'></a></strong>
 <p>${this.description.substring(0,20)}...</p>`  
})







CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})



module.exports=mongoose.model('Campground', CampgroundSchema )