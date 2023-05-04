const fs = require('fs');
const { join } = require('path');

(function makeDirectory() {
  const filesCopyDir = join(__dirname, 'files-copy');

  fs.access(filesCopyDir, fs.constants.F_OK, (err) => {
    if (err) {
      fs.promises.mkdir(filesCopyDir, { recursive: true });
      copyDir();
    }
    else {
      clearDir(filesCopyDir);
      copyDir();
    }
  })
})();

const clearDir = (dir) => {
  fs.promises.readdir(dir, { withFileTypes: true }).then((files) => {
    files.forEach(el => {
      fs.unlink(join(__dirname, 'files-copy', el.name), err => {
        if (err) throw err;
      });
    })
  });
}

const copyDir = () => {
  const filesDir = join(__dirname, 'files');
  fs.promises.readdir(filesDir, { withFileTypes: true }).then((files) => {
    files.forEach(el => {
      const file = join(__dirname, 'files', el.name);
      const copyFile = join(__dirname, 'files-copy', el.name);

      fs.promises.copyFile(file, copyFile);
    })
  })
}
