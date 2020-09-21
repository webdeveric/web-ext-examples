const path = require('path');

module.exports = {
  verbose: true,
  sourceDir: path.join(__dirname, 'src'),
  artifactsDir: path.join(__dirname, 'build'),
  build: {
    overwriteDest: true,
  },
  run: {
    startUrl: [
      'about:devtools-toolbox?type=extension&id=web-ext-examples-request-permissions%40webdeveric.com',
      'https://webdeveric.com/',
    ],
  },
  ignoreFiles: [ 'package-lock.json' ],
};
