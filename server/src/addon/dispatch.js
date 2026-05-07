const {
  getRootFolders,
  getChildrenFolders,
  createTargetFolder,
  startDuplication,
} = require('../services/drive');

function dispatch(macroName, payload) {
  switch (macroName) {
    case 'getRootFolders':
      return getRootFolders();
    case 'getChildrenFolders':
      return getChildrenFolders(payload.data.id);
    case 'createTargetFolder':
      return createTargetFolder(payload.data.name, payload.data.parentFolderId);
    case 'startDuplication':
      return startDuplication(payload.data.sourceFolder, payload.data.targetFolder);
    default:
      throw new Error(`Invalid macro name: ${macroName}`);
  }
}

/*
/**
 * Central dispatcher for all client-side calls.
 * @param {string} functionName - The name of the function to run.
 * @param {Object} [data] - Optional arguments for the function.
 */
/*
function dispatch(functionName, data) {
  try {
    // Basic Security: Prevent calling private functions or the dispatcher itself
    if (functionName.endsWith('_') || functionName === 'dispatch') {
      throw new Error('Unauthorized function call.');
    }

    if (typeof this[functionName] !== 'function') {
      throw new Error('Function ' + functionName + ' not found.');
    }

    // Execute the function with the provided data
    return this[functionName](data);

  } catch (e) {
    console.error('Dispatch Error: ' + e.toString());
    throw e; // Re-throw so the frontend .withFailureHandler() catches it
  }
}
*/

module.exports = {
  dispatch,
};
