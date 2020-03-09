app.controller('chatController',['$scope', ($scope)=>{
    $scope.onlineList=[];
    $scope.roomList=[];
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
    
}])