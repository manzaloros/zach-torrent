const net = require('net');
const { Buffer } = require('buffer');
const tracker = require('./tracker');

const download = (peer) => {
  const socket = net.Socket();
  socket.on('error', console.error);
  socket.connect(peer.port, peer.ip, () => {
    // write a message here
  });
  socket.on('data', (data) => {
    // handle response
  });
};

module.exports = (torrent) => {
  tracker.getPeers(torrent, (peers) => {
    peers.forEach(download);
  });
};
