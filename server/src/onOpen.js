const { createMenu } = require('./addon/ui');

function onOpen() {
  createMenu();
}

module.exports = onOpen;
