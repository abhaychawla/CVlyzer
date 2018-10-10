/**
 * Resume Data
 */
const resumeData = require('../ResumeData')();

/**
 * Dictionary
 */
const dictionary = require('../../dictionary');

// Underscore
const _ = require('underscore');

module.exports = {
    parseData: parseData
};

/**
 * Parses the required data from extracted resume file data.
 * @param processedFile Processed resume file.
 * @param next Callback function with parameter data.
 */
function parseData(processedFile, next) {
    const data = processedFile.data;

    parseRegularExpressions(data);
    parseDictionaryTitles(data);
    parseDictionaryProfiles(data);

    if (_.isFunction(next)) {
        next(resumeData);
    }
}

/**
 * Parse the content by regular expressions.
 * @param data Resume file data.
 */
function parseRegularExpressions(data) {
    const dictionaryRegularExpressions = dictionary.regularExpressions;
    let regularExpressionFound = false;
    _.forEach(dictionaryRegularExpressions, (regularExpressions, key) => {
        _.forEach(regularExpressions, (regularExpression) => {
            regularExpressionFound = new RegExp(regularExpression).exec(data);
            if (regularExpressionFound) {
                resumeData.setItem(key, regularExpressionFound[0]);
            }
        });
    });
}

/**
 * Parse the content by titles.
 * @param data Resume file data. 
 */
function parseDictionaryTitles(data) {
    const rows = data.split('\n');
 
    for (let i = 0; i < rows.length; i++) {
 
        let row = rows[i];
        let expressionFound = false;
 
        _.forEach(dictionary.titles, (expressions, key) => {
            // Consider title is less than 5 words (in a row)
            if (row.split(' ').length <= 5) {
 
                _.forEach(expressions, (expression) => {
                    
                    expressionFound = new RegExp(expression, 'i').test(row);
                    
                    if (expressionFound) {
                        const dictionaryTitles = _.without(_.flatten(_.toArray(dictionary.titles)), expression).join('|');
                        const searchExpression = `(?:${expression})((.*\n)+?)(?:${dictionaryTitles}|{end})`;
                        const searchData = new RegExp(searchExpression, 'gi').exec(_.toArray(data.split('\n')).slice(i).join('\n'));
                        
                        if (searchData) {
                            resumeData.setItem(key, searchData[1]);
                        }
                    }
                });
            }
        });
    }
}

/**
 * Parse the content by profile links.
 * @param data Resume file data. 
 */
function parseDictionaryProfiles(data) {
    const dictionaryProfiles = dictionary.profiles;
    let profileFound = false;
    resumeData.setItemObject('profiles');
    _.forEach(dictionaryProfiles, (expressions, key) => {
        _.forEach(expressions, (expression) => {
            profileFound = new RegExp(expression).exec(data);
            if (profileFound) {
                resumeData.setItemObject('profiles', key, profileFound[4]);
            }
        });
    });
}
