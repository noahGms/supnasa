const path = require("path");

/**
 * @description Returns the path of uploads folder
 * @returns {string}
 */
exports.getUploadsPath = function () {
  return `${path.dirname(
    require.main.filename || process.mainModule.filename
  )}/uploads`;
};
