const dgram = require('dgram');
const crypto = require('crypto');
const { Buffer } = require('buffer');
const urlParse = require('url').parse;
const torrentParser = require('./torrent-parser');
const util = require('./util');

const udpSend = (socket, message, rawUrl, cb = () => {}) => {
  const url = urlParse(rawUrl);
  socket.send(message, 0, message.length, url.port, url.host, cb);
};

const respType = (res) => {
  const action = res.readUInt32BE(0);
  if (action === 0) return 'connect';
  if (action === 1) return 'announce';
};

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

const parseConnResp = (res) => ({
  action: res.readUInt32BE(0),
  transactionId: res.readUInt32BE(4),
  connectionId: res.slice(8),
});

const buildAnnounceReq = (connId, torrent, port = 6681) => {
  const buf = Buffer.allocUnsafe(98);

  // connection id
  connId.copy(buf, 0);
  // action
  buf.writeUInt32BE(1, 8);
  // transaction id
  crypto.randomBytes(4).copy(buf, 12);
  // info hash
  torrentParser.infoHash(torrent).copy(buf, 16);
  // peerId
  util.genId().copy(buf, 36);
  // downloaded
  Buffer.alloc(8).copy(buf, 56);
  // left
  torrentParser.size(torrent).copy(buf, 64);
  // uploaded
  Buffer.alloc(8).copy(buf, 72);
  // event
  buf.writeUInt32BE(0, 80);
  // ip address
  buf.writeUInt32BE(0, 80);
  // key
  crypto.randomBytes(4).copy(buf, 88);
  // num want
  buf.writeInt32BE(-1, 92);
  // port
  buf.writeUInt32BE(port, 96);

  return buf;
};

const parseAnnounceResp = (res) => {
  const group = (iterable, groupSize, groups = []) => {
    for (let i = 0; i < iterable.length; i += groupSize) {
      groups.push(iterable.slice(i, i + groupSize));
    }
    return groups;
  };

  return {
    action: res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    leechers: res.readUInt32BE(8),
    seeders: res.readUInt32BE(12),
    peers: group(res.slice(20), 6).map((address) => ({
      ip: address.slice(0, 4).join('.'),
      port: address.readUInt32BE(4),
    })),
  };
};

const getPeers = (torrent, cb) => {
  const socket = dgram.createSocket('udp4');
  const url = torrent.announce.toString('utf8');

  // Send connection request
  udpSend(socket, buildConnReq(), url);

  const announceReq = buildAnnounceReq(connResp.connectionId, torrent);

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

module.exports = { getPeers };
