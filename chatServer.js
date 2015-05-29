var express = require('express');
var app = express();
var http = require('http');
http.Server(app);

app.get('/',function(req,res){
  res.send('<h1>Hello World</h1>');
});

var server = app.listen(3000, function(){
  console.log("Listening on localhost:3000");
});
