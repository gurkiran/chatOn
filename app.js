var express = require('express'),
  http      = require('http');
  socketIo  = require('socket.io');

var app = express();

app.set('view engine','jade');

app.use(express.static('./public'));

// app.get('/', (req, res) => {
//   res.end('Hello world !');
// })

app.get('/home', (req, res) => {
  res.render('index',{title :'Chat'});
})

const server = new http.Server(app);
const io = socketIo(server);

io.on('connection',socket => {
  console.log('client connected');
  socket.on('chat:add',data => {
    console.log(data);
    io.emit('chat:added', data)
  });
});


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server started on port ${port}`);
});
