const express = require('express')
var uniqid = require('uniqid');
const app = express()

server = app.listen(1986)

const io = require("socket.io")(server)
const users = {};

io.on('connection', (socket) => {
  console.log('New user connected')

  socket.username = "Anonymous";
  socket.userId = uniqid();
  users[socket.userId] = socket.username;
  io.sockets.emit('users_change', users);

  socket.on('change_username', (data) => {
    socket.username = data.username
    users[socket.userId] = socket.username;
    io.sockets.emit('users_change', users);
  });


  socket.on('disconnect', () => {
    delete users[socket.userId];
    console.log(socket.userId);
    io.sockets.emit('users_change', users);
    console.log('user disconnection');
  });

  socket.on('new_message', (data) => {
    io.sockets.emit('new_message', {message : data.message, userName: socket.username, userId: socket.userId});
  })
})
