const dgram = require('dgram');
const { Buffer } = require('buffer');
const urlParse = require('url').parse;

const udpSend = (socket, message, rawUrl, cb = () => {}) => {
  const url = urlParse(rawUrl);
  socket.send(message, 0, message.length, url.port, url.host, cb);
};

const respType = (res) => {

};

const crypto = require('crypto');

const buildConnReq = () => {
  const buf = Buffer.alloc(16);

  // connection id
  buf.writeUInt32BE(0x417, 0);
  buf.writeUInt32BE(0x27101980, 4);
  // action
  buf.writeUInt32BE(0, 8);
  // transaction id
  crypto.randomBytes(4).copy(buf, 12);

  return buf;
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
