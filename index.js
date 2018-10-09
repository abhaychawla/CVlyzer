/**
 * Resume Parser
 */
const resumeParser = require('./src/resumeParser');

// Input File Path
const inputFilePath = `${process.cwd()}/files/resume.pdf`;

// Output Directory
const outputDirectory =  `${process.cwd()}/files/processed`;

// Logger
const logger = require('tracer').colorConsole();

/**
 * Extract and parse resume file (.pdf, .doc, .html, .txt) data into JSON.
 */
resumeParser.extractAndParseDataFromFile(inputFilePath, outputDirectory)
    .then(processedFileName => {
        logger.trace(`${processedFileName}: Data extracted and parsed into JSON!`);
    })
    .catch(error => {
        logger.error(`Error: ${error}`);
    });
