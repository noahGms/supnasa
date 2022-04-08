const {v4} = require('uuid');
const sharp = require('sharp');
const fs = require('fs');
const {getUploadsPath} = require("../../helpers/folders");

/**
 * @description Save image
 * @param file
 * @returns {Promise<string>}
 */
exports.storeRoverImage = async function(file) {
    const filename = generateFileName(file);

    const path = `${getUploadsPath()}/${filename}`;
    await file.mv(path);

    if (!await checkIfImageHasGoodDimensions(file)) {
        await resizeImage(path);
    }

    return filename;
};

/**
 * @description Delete image
 * @param filename
 * @returns {void}
 */
exports.deleteRoverImage = function(filename) {
    const path = `${getUploadsPath()}/${filename}`;
    return fs.unlinkSync(path);
};

/**
 * @description Resize image
 * @param path
 * @returns {Promise<void>}
 */
async function resizeImage(path) {
    const buffer = await sharp(path)
        .resize(200, 200)
        .toBuffer(path);

    return fs.writeFileSync(path, buffer);
}

/**
 * @description Check image has a good dimensions
 * @param file
 * @returns {Promise<boolean>}
 */
async function checkIfImageHasGoodDimensions(file) {
    const dimensions = await sharp(file.data).metadata();
    return !(dimensions.width > 200 || dimensions.height > 200);
}

/**
 * @description Generate a unique filename for the image
 * @param file
 * @returns {string}
 */
function generateFileName(file) {
    const mimeType = getMimeType(file.mimetype);
    return v4() + mimeType;
}

/**
 * @description Get the mime type of the file
 * @param {string} mimetype
 * @returns {string}
 */
function getMimeType(mimetype) {
    switch (mimetype) {
        case 'image/jpeg':
            return '.jpg';
        case 'image/png':
            return '.png';
        case 'image/gif':
            return '.gif';
        default:
            return '';
    }
}