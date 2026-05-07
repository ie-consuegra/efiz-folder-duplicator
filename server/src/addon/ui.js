const strings = require('../translations/strings');
const { THIS_GOOGLE_APP, LOCALE } = require('../globals');

const UI = THIS_GOOGLE_APP.getUi();

function alert(message) {
  UI.alert(message);
}

function showSidebar() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('index').setTitle(strings('addonName', LOCALE));
  UI.showSidebar(htmlOutput);
}

function createMenu() {
  UI.createMenu(strings('addonName', LOCALE))
    .addItem(strings('showSidebar', LOCALE), 'showSidebar')
    /*
    .addSeparator()
    .addItem(strings('item', LOCALE), 'functionName')
    .addSubMenu(
      UI.createMenu(strings('submenu', LOCALE))
        .addItem(strings('submenuItem', LOCALE), 'functionName'),
    ) */
    .addToUi();
}

module.exports = {
  alert,
  showSidebar,
  createMenu,
};
