var express   = require('express'),
    http      = require('http');
    socketIo  = require('socket.io');

var app = express();

const server = new http.Server(app);
const io = socketIo(server);

const users = [];
const connections =[];

app.set('view engine','jade');

app.use(express.static('./public'));



app.get('/', (req, res) => {
  res.render('index',{title :'Chat'});
})


io.sockets.on('connection', (socket)=> {
  connections.push(socket);
  console.log('connnected: '+ connections.length);

  socket.on('disconnect', (data)=> {
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('connnected: '+ connections.length);
  })
  // send message
  socket.on('send message', (data) => {
    console.log(data);
  io.sockets.emit('new message', {msg: data, user:socket.username});
  })

  socket.on('new message', (data, callback) => {
    callback(true);
    socket.username =data;
    users.push(socket.username);
    updateUsernames();
  })

  function updateUsernames() {
    io.sockets.emit('get users', users)
  }

})





const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server started on port ${port}`);
});
