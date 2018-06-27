const http = require('http');
const express = require('express');
const proxy = require('http-proxy-middleware');
const path = require('path');

const app = express();
const port = process.env.PORT || '8888';
const target = 'https://express-and-sockets.herokuapp.com';

app.use(express.static('public'));

app.use('/api/*', proxy({ target, changeOrigin: true }));

const wsProxy = proxy('/socket.io', { target, ws: true, changeOrigin: true });
app.use(wsProxy);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(port);

server.on('upgrade', wsProxy.upgrade);