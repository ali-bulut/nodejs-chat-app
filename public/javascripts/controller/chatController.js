app.controller('chatController',['$scope', 'chatFactory', 'userFactory', ($scope, chatFactory, userFactory)=>{
    
    //initialization

     function init(){
         userFactory.getUser().then(user => {
            $scope.user=user;                       
         })
     }
    
     init();
    
    $scope.onlineList=[];
    $scope.roomList=[];
    $scope.chatClicked=false;
    $scope.loadingMessages=false;
    $scope.chatName="";
    $scope.roomId="";
    $scope.message="";
    $scope.messages=[];
    $scope.user={};

    const socket=io.connect("http://localhost:3000");

    socket.on('onlineList',users=>{
        $scope.onlineList=users;
        $scope.$apply();
    })

    $scope.newRoom = () =>{
        //let randomName=Math.random().toString(36).substring(7);
        let roomName=window.prompt("Enter Room Name");

        if(roomName!=='' && roomName!==null)
            socket.emit('newRoom',roomName);
    }

    socket.on('roomList',rooms=>{
        $scope.roomList=rooms;
        $scope.$apply();
    })

    $scope.activeTab=1;
    $scope.changeTab = (tab) => {
        $scope.activeTab=tab;
    }

    $scope.switchRoom=(room) =>{
        $scope.chatName=room.roomName;
        $scope.roomId=room.roomId;
        $scope.chatClicked=true;

        //eğer messages içinde belirtilen roomId yoksa veri çekme işlemlerini yapacak.
        //eğer varsa boşa tekrar veri çekmeyle uğraşmayacak
        if(!$scope.messages.hasOwnProperty(room.roomId)){
            $scope.loadingMessages=true;
            chatFactory.getMessages(room.roomId).then(data=>{
            $scope.messages[room.roomId] = data;
            $scope.loadingMessages=false;
        })
        }
    }

    $scope.newMessage = ()=>{
        if($scope.message.trim() !== ''){
        socket.emit('newMessage', {
            message:$scope.message,
            roomId:$scope.roomId
        })

        $scope.messages[$scope.roomId].push({
            userId:$scope.user._id,
            name:$scope.user.name,
            surname:$scope.user.surname,
            message:$scope.message
        })

        $scope.message="";
    }
    }
    
    socket.on('receiveMessage',data=>{
        $scope.messages[data.roomId].push({
            userId:data.userId,
            name:data.name,
            surname:data.surname,
            message:data.message
        })
        $scope.$apply();
    })

}])