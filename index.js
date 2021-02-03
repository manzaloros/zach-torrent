const fs = require('fs');
const bencode = require('bencode');
const torrentParser = require('./torrent-parser');
const tracker = require('./tracker');

console.log(typeof tracker);
const torrent = torrentParser.open('puppy.torrent');

tracker.getPeers(torrent, (peers) => {
  console.log(`list of peers: ${peers}`);
});
