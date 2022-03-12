//express
const express = require("express"); //importing express module
const app = express(); //creating express app
const http = require("http");
const port = 3000; //set express port
// const server = http.createServer(app);
app.set("port", process.env.PORT || 3000);
const { Server } = require("socket.io");

const server = http.createServer(app).listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});

const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/landing.html");
});

io.on("connection", (socket) => {
  socket.on("event", (msg, room) => {
    io.in(room).emit("event", msg);
  });

  socket.on("send-message", (msg, room, userName) => {
    io.in(room).emit("receive-msg", msg, userName);
  });

  function joinRoom(socket, room) {
    if (socket.room) {
      console.log("leaving room: " + socket.room);
      socket.leave(socket.room);
    }
    socket.join(room);
    socket.room = room;
    console.info(socket.id + " joined room " + room);
  }

  socket.on("join-room", (room, cb) => {
    joinRoom(socket, room);
    cb(`You joined room: ${room}`);
  });
  socket.on("typing", (msg, room) => {
    io.in(room).emit("typing", msg);
  });
});

// server.listen(port, () => {
//   console.log(`listening on http://localhost:${port}`);
// });

//https://gist.github.com/kylewelsby/2b49d2db31d45b939479
