//redis session store
//kullanmamızın sebebi girilen datayı redis session'da tutmak 
//yani örneğin uygulamaya giriş yaptık sonra sunucuyu kapatıp açtıktan sonra normalde tekrar giriş ekranına
//atması gerekirken redis kullanarak bunu ortadan kaldırdık. Giriş yapılan hesap redis'in session store'unda
//tutulduğu için sunucuyu kapatıp açsak da tekrar giriş yapmamıza gerek kalmaz. Gerekli giriş session'ı
//direkt olarak redis'in session store'undan çekilir.
const redis=require('redis');
const session=require('express-session');
const redisStore=require('connect-redis')(session);
const client=redis.createClient(process.env.REDISCLOUD_URL);


module.exports=new redisStore({client});