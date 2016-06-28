var express   = require('express'),
    http      = require('http');
    socketIo  = require('socket.io');

var app = express();

const server = new http.Server(app);
const io = socketIo(server);

const users = [];
const connections =[];
const age = [];
const gender = [];
const location =[];

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
    age.splice(age.indexOf(socket.age), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('connnected: '+ connections.length);
  })
  // Send message
  socket.on('send message', (data) => {
  io.sockets.emit('new message', {msg: data, user:socket.username, age:socket.age, gender:socket.gender, location:socket.location});
  })

  socket.on('new user', (data, callback) => {
    callback(true);
    socket.username =data;
    socket.age=data;
    socket.gender=data;
    socket.location=data;
    users.push(socket.username);
    age.push(socket.age);
    gender.push(socket.gender);
    location.push(socket.location);
    updateUsernames();
  })

  function updateUsernames() {
    io.sockets.emit('get users', users, age, gender, location)
  }

})


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server started on port ${port}`);
});
