const express=require('express');
const router=express.Router();
const passportGoogle=require('../auth/google');

//scope ile google ile login olacak kişiden hangi bilgileri isteyeceğini belirtirsin.
//sadece profile bilgilerini istiyoruz. İstersek virgül ile email vs. de isteyebiliriz.
//login with google butonuna basılınca bu çalışacak.
router.get('/google', passportGoogle.authenticate('google',{scope:['profile']}))

//kullanıcı google ile login olup döndüğü anda yapılacak işlemler
//login başarısızsa / yani homepage'e döndür. Başarılıysa /chat sayfasına yönlendir.
router.get('/google/callback', passportGoogle.authenticate('google',{failureRedirect:'/'}), (req,res)=>{
    res.redirect('/chat');
})

module.exports=router;