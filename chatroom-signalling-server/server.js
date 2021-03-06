const express = require('express')
const app = express()
const cors = require('cors');
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const PORT = process.env.PORT || 3002;

app.disable('x-powered-by');
app.use(cors());
app.get('/', (req, res) => {
  res.status(200).send({roomId:`${uuidV4()}`});
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

server.listen(PORT)
