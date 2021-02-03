const fs = require('fs');
const bencode = require('bencode');
const bignum = require('bignum');

const open = async (filepath) => {
  const file = await fs.readFile(filepath);
  return bencode.decode(file);
};

const getSize = (torrent) => {
  const size = torrent.info.files
    ? torrent.info.files.map((file) => file.length)
      .reduce((sum, currentLength) => sum + currentLength)
    : torrent.info.length;

  return bignum.toBuffer(size, { size: 8 });
};

const infoHash = (torrent) => {
  const info = bencode.encode(torrent.info);
  return crypto.createHash('sha1').update(info).digest();
};

module.exports = { open, getSize, infoHash };
