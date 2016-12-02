var WebSocketServer = require("ws").Server
var http = require("http")
  var express = require("express")
var app = express()
  var port = process.env.PORT || 5000
  var connects = [];

  app.use(express.static(__dirname + "/"))

  var server = http.createServer(app)
server.listen(port)

  console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
  console.log("websocket server created")

  wss.on("connection", function(ws) {
    //var id = setInterval(function() {
    //  ws.send(JSON.stringify(new Date()), function() {  })
    //}, 1000)
    connects.push(ws);
    DEB_sendME("new Commer");


    console.log("websocket connection open")

      ws.on("close", function() {
        connects = connects.filter(function(conn,i){
          return (conn === ws) ? false : true ;
        });
        DEB_sendME("byebye");
      })
    ws.on('message',function(msg){
      var text = JSON.parse(msg).text;
      var response = {'success':true,'text':text,'type':'message'};
      console.log(text);
      if(isBotMention(text) !== -1){
        var mention = getBotMention(text);
        if(mention=="ping"){
          response["type"]="bot";
          response["text"]="pong";
          response["success"]=true;
        }else{
          response["success"]=false;
          response["type"]="bot";
          response["text"]="";
        }
      }
      console.log(JSON.stringify(response).replace(/'/g,"\'"));
      broadcast(JSON.stringify(response).replace(/'/g,"\'"));
    })

  })

function broadcast(msg){
  connects.forEach(function(socket,i){
    socket.send(msg);
  });
}

function DEB_sendME(msg){
  return ;
  //connects[0].send(msg);
}

var isBotMention = function(msg){
  var regex = /^@{0,1}bot[: 　]{1}/;
  return msg.search(regex);
};

var getBotMention = function(msg){
  var regex = /^@{0,1}bot[: 　]{1}/;
  return msg.replace(regex,"");
};
