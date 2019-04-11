const path = require('path');
const fs = require('fs');

const entryMap = {};

const pagesFilePath = path.resolve(__dirname, 'src', 'pages');

function populateEntryMap(absoluteFilePath) {
  // get the files inside the given path
  const node = fs.readdirSync(absoluteFilePath, {withFileTypes: true});
  for (let i = 0; i < node.length; i++) {
    // get the absolute file path of the current file
    const nodeFilePath = path.resolve(absoluteFilePath, node[i].name)
    // if its a directory then we recursively check if there are any index.js files inside
    if (node[i].isDirectory()) {
      populateEntryMap(nodeFilePath);
    } else if (node[i].isFile() && node[i].name === 'index.js') {
      // from '.../src/pages/<remaining path to index.js file>' to just '<remaining path to index.js file>'
      const relativePath = path.relative(pagesFilePath, nodeFilePath);
      entryMap[relativePath] = nodeFilePath
    }
  }
}
populateEntryMap(pagesFilePath);

module.exports = {
  entry: entryMap,
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'static', 'frontend'),
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
    },{
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }],
  },
  resolve: {
    alias: {
      utils: path.resolve(__dirname, 'src', 'utils/'),
      api: path.resolve(__dirname, 'src', 'api/'),
      components: path.resolve(__dirname, 'src', 'components/'),
    },
  },
  watch: true,
};