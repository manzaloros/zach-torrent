const fs = require('fs');
const bencode = require('bencode');

fs.readFile('puppy.torrent', (err, file) => {
  if (err) {
    console.log(err);
    return;
  }
  const torrent = bencode.decode(file);
  console.log(torrent.announce.toString('utf8'));
});
