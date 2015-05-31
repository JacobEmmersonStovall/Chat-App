var express = require('express');
var http = require('http');


var app = express();
var server = http.Server(app);
var io = require('socket.io')(http).listen(server);

var userCount = 0
var usernames = [];

app.use(express.static(__dirname + '/assets'));

app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

var chatBot = function(socket,msg){
  switch(msg){
    case "!help":
      io.to(socket.id).emit('alert', "Commands:");
      io.to(socket.id).emit('alert', "!numUsers - Get the number of users in room");
      io.to(socket.id).emit('alert', "!users - Get all of the usernames currently in room");
      return "!helloBot - Say hello to Chat Bot";
    case "!helloBot":
      return "Chat Bot: Hello "+socket.username;
    case "!numUsers":
      if(userCount == 1){
        return "Chat Bot: There is "+userCount+" user currently on.";
      }
      else {
        return "Chat Bot: There are "+userCount+" users currently on.";
      }
    case "!users":
      if(usernames.length == 1){
        return "You're the only person on right now."
      }
      var userString = "Chat Bot: The people currently on are "
      for(i = 0; i < usernames.length; i++){
        if(i == usernames.length-1){
          userString = userString + "and "+usernames[i];
        }
        else{
          userString = userString + usernames[i] + ", ";
        }
      }
      return userString;
    default:
      return "Chat Bot: I'm sorry I don't know what you want.";
  }
}

var outputMessage = function(usr,msg){
  return usr+ ": "+msg;
}

io.on('connection', function (socket) {
        console.log('User Connected.');
        userCount = userCount + 1;
        var chatBotHello = "Chat Bot: Hello User, I'm Chat Bot. In" +
         " addition to chatting with friends, you can talk to me and I'll give"+
         " you different types of info. (Don't worry, if you type the command"+
         " write, no one will see us talking.) To see all my commands, just type !help."+
         " Also, if the chat is empty, my apologies XD.";
        io.to(socket.id).emit('alert', chatBotHello);
        socket.on('username', function(name){
          if(name.trim() == ""){
            socket.username = "User #"+userCount;
            usernames.push(socket.username);
            io.emit('alert', socket.username+" has entered the chat. There are"+
                    " currently "+userCount+" user(s) in the room.");
          }
          else{
            var found = usernames.indexOf(name) > -1;
            if(found){
              io.to(socket.id).emit('newName');
            }
            else{
              socket.username = name;
              usernames.push(name);
              io.emit('alert', name+" has entered the chat. There are"+
                      " currently "+userCount+" user(s) in the room.");
            }
          }
        });
        socket.on('chat message', function (msg) {
          if(msg.charAt(0) == '!'){
            io.to(socket.id).emit('chat message', outputMessage(socket.username,msg));
            io.to(socket.id).emit('alert', chatBot(socket,msg));
          }
          else{
            io.emit('chat message', outputMessage(socket.username,msg));
          }
        });
        socket.on('disconnect', function(){
          userCount = userCount - 1;
          usernames.splice(usernames.indexOf(socket.username),1);
        });
});

server.listen(3000, function(){
  console.log("stovechat.me is live dawg");
});
