/*
const doGet = require('./doGet');
const doPost = require('./doPost');
const requestHandler = require('./request/requestHandler');

global.doGet = doGet;
global.doPost = doPost;
global.requestHandler = requestHandler;

Container-bound app.js basic script

const onOpen = require('./onOpen');

global.onOpen = onOpen;

Expose other functions as needed, every function that will be run by clicking an item menu
must be exposed globally.
*/

const onOpen = require('./onOpen');
const { showSidebar } = require('./addon/ui');
const { dispatch } = require('./addon/dispatch');

global.onOpen = onOpen;
global.showSidebar = showSidebar;
global.dispatch = dispatch;
