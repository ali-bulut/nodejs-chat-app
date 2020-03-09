const redis=require('redis');
const shortId=require('shortid');
const redisClient=require('../redisClient');

//ctor 
//Users classı çalıştığında kendi oluşturduğumuz getClient methodu ile redisi ayağa kaldırıyoruz.
function Rooms(){
    this.client=redisClient.getClient();
}

module.exports=new Rooms();

//redis'e data ekleme
Rooms.prototype.upsert=function(roomName){
    const newId=shortId.generate();
    this.client.hset('rooms','@Room:'+newId,JSON.stringify({roomId:'@Room:'+newId,roomName:roomName,when:Date.now()}),(err)=>{
        if(err)
            console.error(err);
    })
}

Rooms.prototype.list=function(callback){
    let roomList=[];
    this.client.hgetall('rooms',function(err,rooms){
        if(err){
            console.error(err);
            return callback([]);
        }

        for(let room in rooms){
            //redis'te string olarak tutulan datayı Json'a çevirip diziye ekledik.
            roomList.push(JSON.parse(rooms[room]))
        }

        return callback(roomList);
    })
}