const fs = require('fs');
const { join, extname, parse } = require('path');

const DIR_COMPONENTS = join(__dirname, 'components');
const INDEX_FILE = join(__dirname, 'project-dist', 'index.html');

fs.access(join(__dirname, 'project-dist'), fs.constants.F_OK, (err) => {
  if (err) {
    fs.promises.mkdir(join(__dirname, 'project-dist'));
    createIndexFile();
    createStyleFile();
    copyDirectory();
  } else {
    createIndexFile();
    createStyleFile();
    copyDirectory();
  }
});

function createIndexFile() {
  const readStreamTemplate = fs.createReadStream(join(__dirname, 'template.html'));
  readStreamTemplate.on('data', data => {
    let template = data.toString();

    fs.promises.readdir(DIR_COMPONENTS, { withFileTypes: true }).then((files) => {
      let arrComponents = files.filter(el => el.isFile() && extname(el.name) === '.html');

      for (let i = 0; i < arrComponents.length; i += 1) {
        const fileName = parse(arrComponents[i].name).name;
        const fileDirComponents = join(DIR_COMPONENTS, arrComponents[i].name);
        const readStream = fs.createReadStream(fileDirComponents);
        readStream.on('data', data => {
          template = template.replace(`{{${fileName}}}`, `${data.toString().trim()}`);
          if (i === arrComponents.length - 1) {
            fs.writeFile(INDEX_FILE, template, (err) => {
              if (err) throw err;
            });
          }
        });
      }
    });
  });
}

function createStyleFile() {
  const STYLE_FILE = join(__dirname, 'project-dist', 'style.css');
  const writeStream = fs.createWriteStream(STYLE_FILE);

  fs.promises.readdir(join(__dirname, 'styles'), { withFileTypes: true }).then((files) => {
    files.filter(el => el.isFile() && extname(el.name) === '.css')
      .forEach(file => {
        const fileDirStyles = join(__dirname, 'styles', file.name);
        const readStream = fs.createReadStream(fileDirStyles);
        readStream.on('data', data => {
          writeStream.write(`${data.toString()}\n`);
        });
      });
  });
}

async function copyDirectory() {
  const assetsDir = join(__dirname, 'assets');
  const assetsCopyDir = join(__dirname, 'project-dist', 'assets');

  fs.access(assetsCopyDir, fs.constants.F_OK, (err) => {
    if (err) {
      createDir();
    } else { removeDir(assetsCopyDir); }
  });

  function createDir() {
    fs.promises.mkdir(assetsCopyDir, { recursive: true });
    copyDirFile(assetsDir, assetsCopyDir);
  }

  function copyDirFile(dir_from, dir_to) {
    fs.readdir(dir_from, { withFileTypes: true }, (err, files) => {
      files.forEach(el => {
        let path_from = join(dir_from, el.name);
        let path_to = join(dir_to, el.name);

        if (el.isFile()) {
          fs.promises.copyFile(path_from, path_to);
        } else {
          fs.promises.mkdir(path_to, { recursive: true });
          copyDirFile(path_from, path_to);
        }
      });
    });
  }

  function removeDir(path) {
    (async function delDir() {
      const files = await fs.promises.readdir(path);

      if (files.length > 0) {
        files.forEach(function (filename) {
          if (!filename.includes('.')) {
            removeDir(path + '/' + filename);
          } else {
            fs.promises.unlink(path + '/' + filename);
          }
        });
      }

      if (files.length === 0) {
        fs.promises.rmdir(path);
      }

    })();
    createDir();
  }
}