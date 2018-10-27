const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');

// Create storage engine
const storage = new GridFsStorage({
    url: `${process.env.MONGO_CONNECTION_URL}/${process.env.MONGO_DB_NAME}`,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
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
