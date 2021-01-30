const dgram = require('dgram');
const { Buffer } = require('buffer');
const urlParse = require('url').parse;

const udpSend = (socket, message, rawUrl, cb = () => {}) => {
  const url = urlParse(rawUrl);
  socket.send(message, 0, message.length, url.port, url.host, cb);
};

const respType = (res) => {

};

const buildConnReq = () => {

};

const parseConnResp = (res) => {

};

const buildAnnounceReq = (connId) => {

};

const parseAnnounceResp = (res) => {

};

const getPeers = (torrent, cb) => {
  const socket = dgram.createSocket('udp4');
  const url = torrent.announce.toString('utf8');

  // Send connection request
  udpSend(socket, buildConnReq(), url);

  socket.on('message', (res) => {
    if (respType(res) === 'connect') {
    // receive and parse connect response
      const connResp = parseConnResp(res);
      // send announce request
      const announceReq = buildAnnounceReq(connResp.connectionId);
      udpSend(socket, announceReq, url);
    } else if (respType(res) === 'announce') {
      // parse announce response
      const announceResp = parseAnnounceResp(res);
      // pass peers to callback
      cb(announceResp.peers);
    }
  });
};

module.exports = getPeers;
