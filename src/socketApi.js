const socketio=require('socket.io');

const io=socketio();

const socketApi={
    io:io
};

//libs
const Users=require('./lib/Users');
const Rooms=require('./lib/Rooms');
const Messages=require('./lib/Messages');


const socketAuthorization=require('../middleware/socketAuthorization');

//socket.io'da middleware kullanmak için use methodunu kullanırız.
//bu middleware ile socketAuthorization ile socket.io çalışmadan önce bir kullanıcının sisteme giriş yapıp
//yapmadığına bakar. Eğer yapılmamışsa socket.io'yu çalıştırmaz.
io.use(socketAuthorization);

//github.com/socketio/socket.io-redis
//socket.io redis adapter
//örneğin birden fazla sunucumuz var.
//1 -> localhost:3000
//2 -> localhost:3001

//localhost:3000 server'ında yapılan herhangi bir işlemde tüm sunuculara bir cevap dönmesini istiyorsak
//socket.io redis adapter'ı kullanırız.
//yani broadcast emit yaptığımızda normalde sadece hangi server üzerindeysen o server'a bağlanan kullanıcılar
//bu emit'e erişebilirken redis adapter'ı kullandığımızda hangi server üzerinde olursan ol bu emit'e erişebilirsin.

//yani örn localhost:3000 üzerinden bir kullanıcı sisteme giriş yaptı ve her giriş yapan kullanıcı için
//merhaba 'user_name' şeklinde bir çıktı dönmek istiyoruz.
//broadcast ile bunu sadece aynı server üzerinde yani sadece localhost:3000'de olan kullanıcılara gösterebilirken
//redis adapter'ı kullanarak localhost:3001'de olan kullanıcı da localhost:3000'de giriş yapan kullanıcıyı görebilir.

//bu işlemde redis'in pubsub özelliğini kullanıyoruz. Bu özelliğin amacı gelen datayı diğer sunuculara
//da aktarabilmektir. Yani redis'in db özelliği dışında başka özellikleri de vardır.


io.on('connection', socket => {
    console.log('A user logged in with name is '+socket.request.user.name);

    //request.user derken google.js'te done kısmına yazdığımız user'ı kastediyoruz. Yani
    //user.name vs dediğimizde db'deki kayıtları getiriyoruz.
    Users.upsert(socket.id,socket.request.user);

    Users.list(users=>{
        io.emit('onlineList',users);
    })

    Rooms.list(rooms=>{
        io.emit('roomList',rooms);
    })

    socket.on('newRoom',roomName=>{
        Rooms.upsert(roomName);
        Rooms.list(rooms=>{
            io.emit('roomList',rooms);
        })
    })

    socket.on('newMessage',data => {
        const messageData={
            ...data,
            userId:socket.request.user._id,
            name:socket.request.user.name,
            surname:socket.request.user.surname
        }
        Messages.upsert(messageData);
        socket.broadcast.emit('receiveMessage',messageData);


    })

    socket.on('disconnect',()=>{
        Users.remove(socket.request.user._id);

        Users.list(users=>{
            io.emit('onlineList',users);
        })
    })
})

module.exports=socketApi;