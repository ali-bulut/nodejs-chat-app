const passport=require('passport');
const GoogleStrategy=require('passport-google-oauth20');

//model
const User = require('../models/users');

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_LOGIN_CLIENT_ID,
    clientSecret: process.env.GOOGLE_LOGIN_SECRET_KEY,
    callbackURL: process.env.GOOGLE_LOGIN_CALLBACK_URL
}, ((accessToken, refreshToken, profile, done)=> {
    const data = profile._json;
    
    User.findOrCreate({
        //bu data'dan veritabanında zaten varsa hiç eklemeden geç ve oturum aç
        // ama eğer yoksa ekleme işlemine başla ekledikten sonra da oturumu direkt aç
        'googleId': data.sub
    },{
        name:data.given_name,
        surname:data.family_name,
        profilePhotoUrl:data.picture
    }, (err,user)=>{
        return done(err,user);
    })
})))

//dönen user'ın sessiona atanması için yazmamız gereken serileştirme işlemi
passport.serializeUser((user,done) => {
    done(null,user);
})

//projenin bir yerinde session'ı değiştirmek istersek de deserileştirme işlemi yaparız.
passport.deserializeUser((user,done) => {
    done(null,user);
})

module.exports=passport;