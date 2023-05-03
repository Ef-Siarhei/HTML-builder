const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, 'text.txt');
const readStream = new fs.ReadStream(src, 'utf-8');
const { stdout } = process;

let data = '';
readStream.on('data', chuck => { data += chuck });
readStream.on('end', () => stdout.write(data));