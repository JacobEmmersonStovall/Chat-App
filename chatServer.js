var express = require('express');
var http = require('http');


var app = express();
var server = http.Server(app);
var io = require('socket.io')(http).listen(server);

app.use(express.static(__dirname + '/assets'));

app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
        socket.on('chat message', function (msg) {
          if(msg === '!helloBot'){
            io.to(socket.id).emit('chat message', msg);
            io.to(socket.id).emit('chat message', "Chat Bot: Hello User");
          }
          else{
            io.emit('chat message', msg);
          }
    });
});

server.listen(3000, function(){
  console.log("Listening on localhost:3000");
});
