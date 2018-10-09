/**
 * Processor
 */
const processor = require('./utils/processor');

module.exports = {
    extractAndParseDataFromFile: extractAndParseDataFromFile
};

/**
 * Extracts and parses resume file data into JSON,
 * and on success resolves with the file name.
 * @param inputFilePath Input file path.
 * @param outputDirectory Output directory.
 * @returns {Promise}
 */
function extractAndParseDataFromFile(inputFilePath, outputDirectory) {
    return new Promise((resolve, reject) => {
        processor.processFile(inputFilePath, outputDirectory, (error, processedFileName) => {
            if (error) {
                return reject(error);
            }
            return resolve(processedFileName);
        });
    });
}
