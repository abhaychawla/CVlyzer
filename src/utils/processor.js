/**
 * Extractor
 */
const extractor = require('./libs/extractor');

// Underscore
const _ = require('underscore');

// Logger
const logger = require('tracer').colorConsole();

module.exports = {
    processFile: processFile
};

/**
 * Processes the resume file.
 * @param inputFilePath Input file path.
 * @param outputDirectory Output directory.
 * @param next Callback function with parameters error and processed file name.
 * @returns {function}
 */
function processFile(inputFilePath, outputDirectory, next) {
    extractor.extractData(inputFilePath, (error, processedFile) => {
        if (_.isFunction(next)) {
            if (error) {
                return next(error);
            }
            logger.trace(`Data extracted.`);
            const file = require('./File')(processedFile);
            file.parseData((data) => {
                logger.trace(`Data parsed.`);
                file.storeData(data, outputDirectory, (error) => {
                     if (error) {
                         return next(error);
                     }
                     logger.trace(`Data succesfully saved.`);
                     return next(null, processedFile.name);
                });
            });
        }
    });
}
