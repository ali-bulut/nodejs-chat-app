const redis=require('redis');

const getClient=()=>{
    return redis.createClient({
        port:process.env.REDIS_PORT,
        host:process.env.REDIS_URI,
        auth_pass:process.env.REDIS_PASS
    })
}

module.exports.getClient=getClient;