const redis=require('redis');

const getClient=()=>{
    return redis.createClient(process.env.REDISCLOUD_URL)
}

module.exports.getClient=getClient;