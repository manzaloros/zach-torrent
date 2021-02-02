const fs = require('fs');
const bencode = require('bencode');
const tracker = require('./tracker');

fs.readFile('puppy.torrent', (err, file) => {
  if (err) {
    console.log(err);
    return;
  }
  const torrent = bencode.decode(file);
  console.log(torrent.announce.toString('utf8'));
});

tracker.getPeers(torrent, (peers) => {
  console.log(`list of peers: ${peers}`);
});
