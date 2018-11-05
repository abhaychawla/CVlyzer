/**
 * Extractor
 */
const extractor = require('./libs/extractor');

// Underscore
const _ = require('underscore');

// Logger
const logger = require('tracer').colorConsole();

module.exports = {
    processUrl: processUrl
};

/**
 * Processes the resume file.
 * @param inputFilePath Input file path.
 * @param next Callback function with parameters error and processed file name.
 * @returns {function}
 */
function processUrl(inputFilePath, next) {
    extractor.extractDataUrl(inputFilePath, (error, processedFile) => {
        if (_.isFunction(next)) {
            if (error) {
                return next(error);
            }
            logger.trace(`Data extracted.`);
            let file = require('./File')(processedFile);
            
            file.parseData((data) => {
                logger.trace(`Data parsed.`);
                file.storeData(data, (error) => {
                     if (error) {
                         return next(error);
                     }
                     logger.trace(`Data succesfully saved.`);
                     return next(null, processedFile);
                });
            });
        }
    });
}
