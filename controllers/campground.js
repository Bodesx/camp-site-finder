const Campground=require('../models/campgrounds')
const cloudinary = require('cloudinary').v2
const Geocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.mapbox_token
const Geocode= Geocoding ({accessToken: mapBoxToken})


//home page
module.exports.home= async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render ('campground/home', {campgrounds} ); 
}


//index campground
module.exports.index= async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render ('campground/index', {campgrounds} ); 
}
//New campground
 module.exports.NewForm=(req,res)=>{
    res.render('campground/new')
}
//create campground
module.exports.CreateCampground= async (req, res,next)=>{ 
    // forward geocoding
const GeoData= await Geocode.forwardGeocode({
  query: req.body.campground.location,
  limit: 1  
}).send()
    const campground =new Campground(req.body.campground)
    campground.geometry=GeoData.body.features[0].geometry
    campground.images= req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.author=req.user._id
     await campground.save();
     console.log('campground')
     req.flash('success','successfully made a campground');
    res.redirect(`/campgrounds/${campground._id}`)

}
//show page
module.exports.Show=async (req,res,)=>{
    const campground =await Campground.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('author');
    console.log(campground)
    if(!campground){
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campground/show', {campground})
}

module.exports.Edit=async (req, res)=>{
    const{id}=req.params
  const campground =await Campground.findById(id) 
 if(!campground){
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
     }
    res.render('campground/edit', {campground})
}

//Update page
module.exports.Update=async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const image= req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.images.push(...image);
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
    await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.Delete=async (req,res)=>{
    const{ id } =req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}
