const express = require('express');
const app = express();
//socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);

// 加入線上人數計數
let onlineCount = 0;

app.get('/', (req, res) => {
    // res.send('Hello, World!');
    res.sendFile(__dirname+'/views/index.html')
})

//當發生連線事件
io.on('connection', (socket) => {
    
    onlineCount++;
    io.emit('online', onlineCount);

    socket.on('send', (msg) => {
        console.log(msg);
        if (Object.keys(msg).length < 2) return;
        io.emit('msg',msg);
    })

    //當發生離線事件
    socket.on('disconnect', () => {
        onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1;
        io.emit('online', onlineCount);
    })
})
server.listen(3000, () => {
    console.log("Server Started. http://localhost:3000")
})