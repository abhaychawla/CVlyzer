// Underscore
const _ = require('underscore');

module.exports = function() {
    return new ResumeData();
};

/**
 * Resume Data
 */
class ResumeData {
    constructor() {
        this.data = {};
    }

    /**
     * Sets a resume data item.
     * @param key Key. 
     * @param value Value or data.
     */
    setItem(key, value) {
        value = value.trim() || '';
        if (value) {
            if (_.has(this.data, key)) {
                this.data[key] += value;
            } else {
                this.data[key] = value;
            }
        }
    }

    /**
     * Sets a resume object data item.
     * @param object Object.
     * @param key Key.
     * @param value Value or data.
     */
    setItemObject(object, key, value) {
        if (!_.has(this.data, object)) {
            this.data[object] = {};
        } else if (value) {
            value = value.trim() || '';
            if (value) {
                if (_.has(this.data[object], key)) {
                    this.data[object][key] += value;
                } else {
                    this.data[object][key] = value;
                }
            }
        }
    }

    /**
     * Converts javascript object data to JSON string.
     */
    stringify() {
        return JSON.stringify(this.data);
    }
}
