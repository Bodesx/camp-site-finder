const { name } = require('ejs');
const mongoose=require('mongoose');
const Campground = require('../models/campgrounds')
const {places, descriptors}=require('./seedhelp')
const cities = require('./cities');


const mad= array => array[Math.floor(Math.random() * array.length)];


//mongoose connection
mongoose.connect('mongodb://localhost:27017/camping',{useNewUrlParser: true,  useUnifiedTopology: true});
const db= mongoose.connection
db.on('error',console.error.bind (console, 'connection error'));
db.once('open',() =>{
    console.log('db connection open')
})


const seedDB= async()=>{
    await Campground.deleteMany({})
    for(let i=0;i<30; i++){
        const random1=Math.floor(Math.random() *20)
        const price=Math.floor(Math.random()*20)+10;

        const camp=new Campground({ author:"63eb529fcbc64fbf36703725",
                                    location:`${cities[random1].city}, ${cities[random1].admin_name}`,
                                    title:`${mad(descriptors)} ${mad(places)}`,
                                    
                                     images: [{url: 'https://res.cloudinary.com/dredw0sx5/image/upload/v1677061762/Camp/uafn6ehtdjmb4dc5ewwj.jpg',
                                     filename: 'Camp/uafn6ehtdjmb4dc5ewwj',}],  
                                     
                                   geometry: {type: 'Point', coordinates: [cities[random1].lng, cities[random1].lat,]},
                                     
                                    description:'loren ipsum this is an experimental camp for further details call me maybe ',
                                    price
        })
        
        await camp.save();
    }


}
seedDB().then(()=>{
    mongoose.connection.close
})
