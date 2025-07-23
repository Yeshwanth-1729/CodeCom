const express=require("express");
const app=express();
const http=require("http");
const server=http.createServer(app);//creates an http server for our app 
//intilaise socket.io server through http server

const {Server}=require("socket.io");
const io=new Server(server);
const userSocketMap={};
const getAllConnectedClients=(roomid)=>{
    return Array.from(io.sockets.adapter.rooms.get(roomid) || []).map(
        socketId=>{
            return {
                socketId,
                username:userSocketMap[socketId]
            };
        }
    );
    
};

io.on('connection',(socket)=>{
    console.log(`user ${socket.id}`);
    socket.on('join',({roomid,username})=>{
        userSocketMap[socket.id]=username
        socket.join(roomid);
        const clients=getAllConnectedClients(roomid);
        clients.forEach(({socketId})=>{
            io.to(socketId).emit('joined',{
                clients,
                username,
                socketId:socket.id
            });
        })


})

socket.on('code-change',({roomid,code})=>{
    socket.in(roomid).emit('code-change',{
        code,
        
    });

});

socket.on("sync-code",({socketId,code})=>{
    io.to(socketId).emit("code-change",{
        code,
        
    });

});


socket.on('disconnecting',()=>{
    
    // console.log(`User disconnected: ${socket.id}`); 
    // const username = userSocketMap[socket.id];
    
    const rooms=[...socket.rooms];
    
    rooms.forEach((roomid)=>{
        socket.in(roomid).emit('disconnected',{
            socketId:socket.id,
            username:userSocketMap[socket.id]
        });
    });
    delete userSocketMap[socket.id];
    socket.leave();
    
});
});

const PORT =process.env.PORT||4000;
server.listen(PORT,()=>{
    console.log(`server is runnning${PORT}`);
})

