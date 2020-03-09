const redis=require('redis');
const shortId=require('shortid');
const _=require('lodash');
const redisClient=require('../redisClient');

//ctor 
//Users classı çalıştığında kendi oluşturduğumuz getClient methodu ile redisi ayağa kaldırıyoruz.
function Messages(){
    this.client=redisClient.getClient();
}

module.exports=new Messages();

//redis'e data ekleme
Messages.prototype.upsert=function({roomId, message, userId, name, surname}){
    const newId=shortId.generate();
    this.client.hset('messages:'+roomId,newId,JSON.stringify({userId:userId,name:name,surname:surname,message:message,when:Date.now()}),(err)=>{
        if(err)
            console.error(err);
    })
}

Messages.prototype.list=function(roomId,callback){
    let messageList=[];
    this.client.hgetall('messages:'+roomId,function(err,messages){
        if(err){
            console.error(err);
            return callback([]);
        }

        for(let message in messages){
            //redis'te string olarak tutulan datayı Json'a çevirip diziye ekledik.
            messageList.push(JSON.parse(messages[message]))
        }

        return callback(_.orderBy(messageList, 'when', 'asc'));
    })
}