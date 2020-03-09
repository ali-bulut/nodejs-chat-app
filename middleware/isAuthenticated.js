function isAuthenticated(req,res,next){
    //isAuthenticated -> passport.js'ten gelen bir method
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.redirect('/');
    }
}

module.exports=isAuthenticated;