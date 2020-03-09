const redis=require('redis');

//ctor 
//Users classı çalıştığında createClient methodu ile redisi ayağa kaldırıyoruz.
function Users(){
    this.client=redis.createClient({
        host:process.env.REDIS_URI,
        port:process.env.REDIS_PORT
    })
}

module.exports=new Users();

//redis'e data ekleme
//connectionId-> bağlantı yapmış kişinin socketId'si
//meta -> bağlantı yapmış kişinin datası
Users.prototype.upsert=function(connectionId,meta){
    
    //'online' -> key kısmı yani tablonun adı gibi düşünebilirsin
    //meta.googleId -> field kısmı yani tablonun içindeki column gibi düşünebilirsin
    //JSON.stringify -> bu method ile json datasını stringe çevirip value kısmına yani column'un içeriğine kaydediriz.
    this.client.hset('online',meta.googleId,JSON.stringify({socketId:connectionId, data:meta, when:Date.now()}),(err)=>{
        if(err)
            console.error(err);
    })
}

//redis'ten data silme
Users.prototype.remove=function(googleId){
    //online table'ından parametre olarak gelen googleId'ye sahip olan field'ı sil.
    this.client.hdel('online',googleId,(err)=>{
        if(err)
            console.error(err);
    });
}

Users.prototype.list=function(callback){
    let active=[];
    this.client.hgetall('online',function(err,users){
        if(err){
            console.error(err);
            return callback([]);
        }

        for(let user in users){
            //redis'te string olarak tutulan datayı Json'a çevirip diziye ekledik.
            active.push(JSON.parse(users[user]))
        }

        return callback(active);
    })
}

