// Mime
const mime = require('mime');
// Path
const path = require('path');
// FS
const fs = require('fs');

// Underscore
const _ = require('underscore');

// Resume Data for all processed files
// const resumeData = [];


module.exports = function(filePath, data) {
    return new ProcessedFile(filePath, data);
};

/**
 * Processed file
 */
class ProcessedFile {
    constructor(filePath, data) {
        this.filePath = filePath;
        // this.fileName = fileName;   //  add file name to view resume
        this.name = path.basename(filePath);
        this.mimeType = mime.getType(filePath);
        // this.extension = mime.getExtension(this.mime);
        this.data = data;
        console.log(this);
    }

    /**
     * Stores parsed data into JSON file. 
     * @param data Parsed resume data.
     * @param outputDirectory Output directory.
     * @param next Callback function with parameter error.
     */
    storeData(data, outputDirectory, next) {
        this.data = data;
        next();
        // if (_.isFunction(next)) {
        //     if (fs.statSync(outputDirectory).isDirectory() && this.data) {
        //         fs.writeFile(`${outputDirectory}/${this.name}.json`, this.data.stringify(), next);
        //     }
        // }
        // resumeData.push(this);
    }
}
