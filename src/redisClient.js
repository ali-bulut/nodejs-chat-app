const redis=require('redis');

const getClient=()=>{
    return redis.createClient({
        host:process.env.REDIS_URI,
        port:process.env.REDIS_PORT,
        password:process.env.REDIS_PASS
    })
}

module.exports.getClient=getClient;