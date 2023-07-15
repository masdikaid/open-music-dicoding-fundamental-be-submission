const fs = require('fs');

module.exports = class {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {recursive: true});
    }
  }

  writeFile(folder, file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${folder}`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {recursive: true});
    }
    
    const filePath = `${path}/${filename}`;
    const fileStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);

      file.on('end', () => {
        resolve(filename);
      });
    });
  }
};
