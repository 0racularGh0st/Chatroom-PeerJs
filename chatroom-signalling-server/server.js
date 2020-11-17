const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.get('/', (req, res) => {
  res.redirect(`http://localhost:8080/room/1000`)
})

// app.get('/:room', (req, res) => {
//   res.render('room', { roomId: req.params.room })
// })
io.set('transports', [ 'websocket' ]);
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3002)
