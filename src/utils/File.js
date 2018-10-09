/**
 * Parser
 */
const parser = require('./libs/parser');

// Underscore
const _ = require('underscore');

// Logger
const logger = require('tracer').colorConsole();

module.exports = function(processedFile) {
    return new File(processedFile);
};

/**
 * File
 */
class File {
    /**
     * @param processedFile Processed file information.
     */
    constructor(processedFile) {
        this.processedFile = processedFile;
    }

    /**
     * Parses resume file data.
     * @param next Callback function with parameter resume data.
     */
    parseData(next) {
        logger.trace(`Parsing Data: ${this.processedFile.filePath}`);
        parser.parseData(this.processedFile, next);
    }

    /**
     * Store resume data in JSON.
     * @param data Parsed resume data.
     * @param outputDirectory Output directory.
     * @param next Callback function with parameter error.
     */
    storeData(data, outputDirectory, next) {
        logger.trace(`Saving Data: ${this.processedFile.filePath}`);
        this.processedFile.storeData(data, outputDirectory, next)
    }
}
