var fs = require('fs');

const removeDirectory = (filePath) => {
    fs.unlinkSync(filePath)
  };

  module.exports = {
      removeDirectory
  }