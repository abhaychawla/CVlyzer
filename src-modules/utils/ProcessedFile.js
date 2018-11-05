// Mime
const mime = require('mime');
// Path
const path = require('path');

module.exports = function(filePath, data) {
    return new ProcessedFile(filePath, data);
};

/**
 * Processed file
 */
class ProcessedFile {
    constructor(filePath, data) {
        this.filePath = filePath;
        this.name = path.basename(filePath);
        this.mimeType = mime.getType(filePath);
        this.data = data;
    }

    /**
     * Stores parsed data. (Elastic Search)
     * @param data Parsed resume data.
     * @param next Callback function with parameter error.
     */
    storeData(data, next) {
        this.data = data;
        next();
    }
}
