/**
 * @typedef {Object} DriveFolder
 * @property {string} id The id of the folder.
 * @property {string} name The name of the folder.
 * @property {string} modified The last updated date of the folder.
 * @property {Array<DriveFolder> | undefined} [children] The children of the folder.
 */

function createTargetFolder(name, parentFolderId) {
  const folder = DriveApp.createFolder(name);
  const targetFolder = {
    id: folder.getId(),
    name: folder.getName(),
    modified: folder.getLastUpdated().toISOString(),
  };

  if (parentFolderId) {
    const parentFolder = DriveApp.getFolderById(parentFolderId);
    folder.moveTo(parentFolder);
  }

  return { success: true, data: targetFolder, message: 'Target folder created successfully' };
}

/**
 * @returns {Array<DriveFolder>} An array of DriveFolder objects.
 */
function getChildrenFolders(folderId) {
  const folder = DriveApp.getFolderById(folderId);
  const children = folder.getFolders();
  const childrenArray = [];
  while (children.hasNext()) {
    const child = children.next();
    childrenArray.push({
      id: child.getId(),
      name: child.getName(),
      modified: child.getLastUpdated().toISOString(),
    });
  }
  return { success: true, data: childrenArray, message: 'Children folders fetched successfully' };
}

/**
 * @returns {Array<DriveFolder>} An array of DriveFolder objects.
 */
function getRootFolders() {
  const root = DriveApp.getRootFolder();

  const rootFolders = root.getFolders();
  const rootFoldersArray = [];

  while (rootFolders.hasNext()) {
    const folder = rootFolders.next();
    rootFoldersArray.push({
      id: folder.getId(),
      name: folder.getName(),
      modified: folder.getLastUpdated().toISOString(),
    });
  }

  const rootFolderTree = {
    id: root.getId(),
    name: root.getName(),
    modified: root.getLastUpdated().toISOString(),
    children: rootFoldersArray,
  };
  return { success: true, data: rootFolderTree, message: 'Root folders fetched successfully' };
}

/**
 * Logs an array of log entries to a Google Apps Script sheet.
 * @param {Array<[string, string, string, string]>} log - Log array of log entries.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - Sheet to log to.
 */
function logToSheet(log, sheet) {
  if (!log || log.length === 0) return;
  const numRows = log.length;
  const numCols = 5;

  sheet.getRange(sheet.getLastRow() + 1, 1, numRows, numCols).setValues(log);
}

/**
 * Recursively copies a folder to a target folder.
 * @param {GoogleAppsScript.Drive.Folder} sourceFolder Folder to be copied
 * @param {GoogleAppsScript.Drive.Folder} targetFolder Parent of the folder to be copied
 * @returns {{success: boolean, data: Array<Array<string>>, message: string}}
 */
function recursiveCopy(sourceFolder, targetFolder) {
  const newFolder = targetFolder.createFolder(sourceFolder.getName());
  const log = [];

  // Log folder creation
  log.push([new Date().toISOString(), 'success', 'Folder', newFolder.getName(), newFolder.getUrl()]);

  const files = sourceFolder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    const copiedFile = file.makeCopy(file.getName(), newFolder);

    const timestamp = new Date().toISOString();
    const status = 'success';
    const type = 'File';
    const itemName = copiedFile.getName();
    const url = copiedFile.getUrl();

    log.push([timestamp, status, type, itemName, url]);
  }

  const folders = sourceFolder.getFolders();
  while (folders.hasNext()) {
    const folder = folders.next();
    const subResult = recursiveCopy(folder, newFolder);
    if (subResult.data && subResult.data.length > 0) {
      log.push(...subResult.data);
    }
  }

  return { success: true, data: log, message: 'Folder copied successfully' };
}

/**
 * @param {DriveFolder} sourceFolder Folder to be copied
 * @param {DriveFolder} targetFolder Parent of the folder to be copied
 * @returns {{success: boolean, data: Object, message: string}}
 */
function startDuplication(sourceFolderData, targetFolderData) {
  const startTime = new Date();
  const sheetName = `${sourceFolderData.name} -> ${targetFolderData.name} - ${startTime.toISOString().substring(0, 19)}`;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);

  sheet.appendRow(['Timestamp', 'Status', 'Type', 'Item Name', 'URL']);
  sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#f3f3f3');

  const sourceFolder = DriveApp.getFolderById(sourceFolderData.id);
  const targetFolder = DriveApp.getFolderById(targetFolderData.id);

  const processLogs = recursiveCopy(sourceFolder, targetFolder);
  logToSheet(processLogs.data, sheet);
}

module.exports = {
  createTargetFolder,
  getRootFolders,
  getChildrenFolders,
  startDuplication,
};
