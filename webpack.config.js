const path = require('path');

module.exports = {
  entry: {
    lib: './src/jquery.panelSnap',
    docs: './src/jquery.panelSnap',
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name]/jquery.panelSnap.js',
  },
};
