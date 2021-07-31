//express

const express = require('express');//importing express module
const app = express(); //creating express app
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


const port = 3000; //set express port

app.use(express.static('public'))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/landing.html');
  // res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  socket.on('event', (msg, room) => { 
    // io.emit('event', msg);
    io.in(room).emit('event', msg);
    // io.emit('broadcast','event', msg);
  })

  socket.on('send-message', (msg, room, userName) => {
    //if no room, broadcast to everyone 
    // if(room === "" || room === "public"){
    //   io.emit('receive', msg); // send to every client 
    //   console.log(msg)
    // }else {  
      io.in(room).emit('receive-msg', msg, userName);
    // }
  })

  function joinRoom(socket, room) {
    if (socket.room) {
      console.log("leaving room: " + socket.room);
      socket.leave(socket.room);
    }
    socket.join(room);
    socket.room = room;
    console.info(socket.id + ' joined room ' + room, socket.room);
}

  socket.on('join-room', (room, cb) => {
    joinRoom(socket, room);
      cb(`You joined room: ${room}`); //use case - message verification
    })
    // socket.on('ping', n => console.log(n));

    socket.on('typing', (msg, room) => {
      // console.log(msg);
      io.in(room).emit('typing', msg);
      // socket.broadcast.emit('typing', data);
    })
}); 

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});



  //https://gist.github.com/kylewelsby/2b49d2db31d45b939479

