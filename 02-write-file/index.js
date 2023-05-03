const fs = require('fs');
const path = require('path');
const srcText = path.join(__dirname, 'text.txt');
const { stdin, stdout } = process;

const stream = new fs.WriteStream(srcText, 'utf-8');

const HI = 'Please enter your text:\n';
const BYE = 'Thanks, good luck learning node.js\n';

stdout.write(HI);
stdin.on('data', data => {
  data.toString().trim() === 'exit'
    ? process.exit(stdout.write(BYE))
    : stream.write(data);
});

process.on('SIGINT', () => {
  process.exit(stdout.write(BYE));
});