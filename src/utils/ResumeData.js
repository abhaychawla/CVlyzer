// Underscore
const _ = require('underscore');

module.exports = function() {
    return new Resume();
};

class Resume {
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

    // setItemObject(key, options) {
    //     if (!_.has(this.data, key)) {
    //         this.data[key] = {};
    //     }

    //     _.forEach(options, (optionValue, optionKey) => {
    //         optionValue = optionValue.trim() || '';
    //         if (optionValue) {
    //             this.data[key][optionKey] = optionValue;
    //         }
    //     });
    // }

    /**
     * Converts javascript object data to JSON string.
     */
    stringify() {
        return JSON.stringify(this.data);
    }
}
