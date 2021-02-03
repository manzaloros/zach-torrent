const torrentParser = require('./src/torrent-parser');
const download = require('./src/download');
const tracker = require('./src/tracker');

const torrent = torrentParser.open(process.argv[2]);

download(torrent);
