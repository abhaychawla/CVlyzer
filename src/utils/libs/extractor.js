/**
 * Textract
 */
const textract = require('textract');

// Underscore
const _ = require('underscore');

// Logger
const logger = require('tracer').colorConsole();

module.exports = {
    extractData: extractData,
    extractDataUrl:extractDataUrl
};

/**
 * Extracts data from file.
 * @param inputFilePath Input file path.
 * @param next Callback function with parameters error and processed file.
 */
function extractData(inputFilePath, next) {
    extractTextFromFile(inputFilePath, (error, processedFile) => {
        if (_.isFunction(next)) {
            if (error) {
                return next(error);
            }
            return next(null, processedFile);
        }
    });
}


function extractDataUrl(inputFilePath, next) {
    extractTextFromUrl(inputFilePath, (error, processedFile) => {
        if (_.isFunction(next)) {
            if (error) {
                return next(error);
            }
            return next(null, processedFile);
        }
    });
}


/**
 * Extracts text from file.
 * @param inputFilePath Input file path.
 * @param next Callback function with parameters error and processed file.
 */
function extractTextFromFile(inputFilePath, next) {
    logger.trace(`Extracting text: ${inputFilePath}`);
    textract.fromFileWithPath(inputFilePath, { preserveLineBreaks: true }, (error, data) => {
        if (_.isFunction(next)) {
            if (error) {
                return next(error);
            }
            data = cleanData(data);
            const processedFile = require('../ProcessedFile')(inputFilePath, data);
            return next(null, processedFile);   
        }
    });
}



function extractTextFromUrl(inputFilePath, next) {
    logger.trace(`Extracting text: ${inputFilePath}`);
    textract.fromUrl(inputFilePath, { preserveLineBreaks: true }, (error, data) => {
        if (_.isFunction(next)) {
            if (error) {
                return next(error);
            }
            data = cleanData(data);
            let processedFile = require('../ProcessedFile')(inputFilePath, data);
            return next(null, processedFile);   
        }
    });
}

/**
 * Cleans data of any white space characters.
 * @param data Data.
 */
function cleanData(data) {
    const rows = data.split('\n');
    let cleanRow = false, cleanRows = [];
    for (let i = 0; i < rows.length; i++) {
        cleanRow = cleanString(rows[i]);
        if (cleanRow) {
            cleanRows.push(cleanRow);
        }
    }
    return `${cleanRows.join('\n')}\n{end}`;
}

/**
 * Cleans a string of any whitespace characters.
 * @param string String.
 */
function cleanString(string) {
    return string.replace(/\r?\n|\r|\t|"/g, '').trim();
}
