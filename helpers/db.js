const mongoose=require('mongoose');

module.exports=()=>{
    //process.env.DB_STRING -> .env içinde tanımladığımız DB_STRING değişkenine karşılık gelen ifadeyi yazar.
    mongoose.connect(process.env.DB_STRING, {useUnifiedTopology:true, useNewUrlParser:true,useFindAndModify:false,useCreateIndex:true});
    mongoose.connection.on('open',()=>{
        //console.log('MongoDB: Connected');
    })
    mongoose.connection.on('error',(err)=>{
        console.log('MongoDB Connection Error: ',err);
    })

    //promise yapısını projemize tanıttık.
    mongoose.Promise=global.Promise;
}