const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const findOrCreate=require('mongoose-find-or-create');

const userSchema=new Schema({
    googleId: {
        type:String,
        unique:true,
    },
    name:String,
    surname: String,
    profilePhotoUrl: String
});

//bu kod ile örneğin user.findbyid tarzı varsayılan işlemler dışında user.findorcreate şeklinde de kullanımı sağlarız.
userSchema.plugin(findOrCreate);

//ilk parametre db'deki collection adı ikincisi de o collectionun şeması
module.exports = mongoose.model('users', userSchema);