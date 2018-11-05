/**
 * Processor
 */
const processor = require('./utils/processor');

module.exports = {
    extractAndParseDataFromUrl: extractAndParseDataFromUrl
};

/**
 * Extracts and parses resume file data into JSON,
 * and on success resolves with the file data.
 * @param inputFilePath Input file path.
 * @returns {Promise}
 */
function extractAndParseDataFromUrl(inputFilePath) {
    return new Promise((resolve, reject) => {
        processor.processUrl(inputFilePath, (error, processedFile) => {
            if (error) {
                return reject(error);
            }
            return resolve(processedFile);
        });
    });
}
