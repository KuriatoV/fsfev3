const express = require('express');
const server = require('http').createServer();
const app = express();
const PORT = 3000;

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname});
});

server.on('request', app);

server.listen(PORT, function () { console.log('Listening on ' + PORT); });

/** Websocket **/
const WsServer = require('ws').Server;

const wss = new WsServer({ server });
wss.broadcast = function(data){
  wss.clients.forEach(client=>{
    client.send(data)
  })
}


// actions
wss.on('connection', (ws)=>{
  const numConnectedClients = wss.clients.size;

  console.log('clients connected: ', numConnectedClients);

  wss.broadcast(`Current visitors: ${numConnectedClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send('websocket is open and ready v2!');
  }

  ws.on('close', ()=> {
    wss.broadcast(`Current visitors: ${wss.clients.size}`);
    console.log('A client has disconnected');
  });

  ws.on('error',(err)=>{
    console.log('ws err',err)
    //
  });
});

/**
 * Broadcast data to all connected clients
 * @param  {Object} data
 * @void
 */
wss.broadcast = function broadcast(data) {
  console.log('Broadcasting: ', data);
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
/** End Websocket **/
