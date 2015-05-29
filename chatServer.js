var express = require('express');
var app = express();
var http = require('http');
http.Server(app);

app.use(express.static(__dirname + '/assets'));

app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

var server = app.listen(3000, function(){
  console.log("Listening on localhost:3000");
});
