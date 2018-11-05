const path = require('path');

// Grid FS Storage for Files
const GridFsStorage = require('multer-gridfs-storage');

// Encrypt Filenames
const crypto = require('crypto');

// Environment Configuration
const config = require('../config/config');

// Create Storage Engine
const storage = new GridFsStorage({
    url: `${config.mongoConnectionUrl}/${config.mongoDbName}`,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = `${buf.toString('hex')}${path.extname(file.originalname)}`;
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

module.exports = storage;
