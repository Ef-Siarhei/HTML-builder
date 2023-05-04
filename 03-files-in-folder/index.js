const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'secret-folder');

fs.promises.readdir(directory, { withFileTypes: true }).then((files) => {
  files.filter(el => el.isFile())
    .forEach(el => {
      const fileName = path.parse(el.name).name;
      const fileExt = path.parse(el.name).ext;
      fs.stat(path.join(directory, el.name), (err, stats) => {
        console.log(fileName + fileExt.replace('.', ' - ') + ' - ' + stats.size);
      });
    });
});