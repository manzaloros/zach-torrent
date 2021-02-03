const fs = require('fs');
const bencode = require('bencode');

const open = async (filepath) => {
  const file = await fs.readFile(filepath);
  return bencode.decode(file);
};

const size = (torrent) => {};

const infoHash = (torrent) => {};

module.exports = { open, size, infoHash };
