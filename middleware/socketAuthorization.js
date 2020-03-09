const cookieParser=require('cookie-parser');
const passportSocketIO=require('passport.socketio');
const redisStore=require('../helpers/redisStore');

function onAuthorizeSuccess(data,accept){
    console.log("successful connection to socket.io");

    accept(null,true);
}

function onAuthorizeFail(data,message,error,accept){
    if(error)
        throw new Error(message);
    console.log('failed connection to socket.io',message);


    accept(null,false);
}

//bu middleware'ı yazmamızın sebebi eğer passportJs ile bir kullanıcı giriş yapmamışsa socket.io'yu kullandırmıycaz.

module.exports=passportSocketIO.authorize({
    cookieParser:cookieParser,
    key:'connect.sid',
    secret:process.env.SESSION_SECRET_KEY,
    store:redisStore,
    success:onAuthorizeSuccess,
    fail:onAuthorizeFail
})