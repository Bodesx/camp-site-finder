const User = require('../models/user')



module.exports.userRegister=(req,res)=>{
    res.render('users/register')
}

module.exports.register=async(req,res)=>{
 try{
    const {email,username,password}=req.body
    const user = new User({email, username})
    const registeredUser= await User.register(user, password)
   req.login(registeredUser,err=>{
    if(err)return next(err)
     req.flash('registration successful')
   res.redirect('/campgrounds')
   })
   
} catch (e){
    req.flash('error', e.message)
    res.redirect('register')
    }
}


module.exports.userLogin=(req,res)=>{
    res.render('users/login')
}


module.exports.userAuth =  (req,res)=>{
    req.flash('success','welcome back')
    const redirectUrl=req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)

}

module.exports.userLogout =  (req,res,next)=>{
    req.logout(function(err){
    if(err){return next(err)}
    req.flash('success','Goodbye')
    res.redirect('/campgrounds') 

    })
}