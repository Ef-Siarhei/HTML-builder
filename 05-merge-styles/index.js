const fs = require('fs');
const { join, extname } = require('path');
const SRC_BUNDLE_FILE = join(__dirname, 'project-dist', 'bundle.css');
const writeStream = new fs.WriteStream(SRC_BUNDLE_FILE);

fs.promises.readdir(join(__dirname, 'styles'), { withFileTypes: true }).then((files) => {
  files.filter(el => el.isFile() && extname(el.name) === '.css')
    .forEach(file => {
      const SRC_STYLE_FILE = join(__dirname, 'styles', file.name);
      const readStream = new fs.ReadStream(SRC_STYLE_FILE);
      readStream.on('data', data => {
        writeStream.write(`${data.toString()}\n`);
      });
    });
});