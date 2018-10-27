const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');
const passport = require('passport');
const elastic = require('../src/elastic');

const storage = require('../config/storage');
const upload = multer({ storage });

const resumeParser = require('../src/resumeParser');

const router = express.Router();

let gfs;
mongoose.connection.on('connected', () => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
});

// @route GET /
// @desc Loads form
// router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
//   console.log(req.body.user);
//     gfs.files.find().toArray((err, files) => {
//       // Check if files
//       if (!files || files.length === 0) {
//         res.json({ files: false });
//       } else {
//         files.map(file => {
//           if (
//             file.contentType === 'application/pdf' || file.contentType === 'image/png'||file.contentType==='image/jpeg'||file.contentType==='image/jpg'||file.contentType==='application/msword'||file.contentType==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//           ) {
//             file.isImage = true;
//           } else {
//             file.isImage = false;
//           }
//         });
//         res.json({ files: files });
//       }
//     });
//   });
  
  // @route POST /upload
  // @desc  Uploads file to DB
  router.post('/upload', passport.authenticate('jwt', {session: false}), upload.array('file',12), (req, res) => {
   //  res.json({ file: req.file });
    // console.log(req.body)
    // gfs.files.find().toArray((err, files) => {
    //   // Check if files
    //   if (!files || files.length === 0) {
    //     return res.status(404).json({
    //       err: 'No files exist'
    //     });
    //   }
  
    //   // Files exist
    //   for(i=0;i<files.length;i++){
    //     console.log(files[i].filename)
    //   }
    // console.log(req.files);
      res.json({ success: true, files: req.files});
    // });
  });

  router.post('/parse', passport.authenticate('jwt', {session: false}), (req, res) => {
    const name = req.user.username;
    let inputUrlPath;
    const promises = [];
    for (let i=0; i<req.body.files.length; i++) {
      inputUrlPath = `http://localhost:8080/files/image/${req.body.files[i].filename}`;
      promises.push(resumeParser.extractAndParseDataFromUrl(inputUrlPath));
    }
    Promise.all(promises).then(response => {
     if (!elastic.indexExists(name)) {
        elastic.createIndex(name);
      }
     elastic.bulk(name, response);
      res.json({success: true, response: response});
    });
  });

  router.get('/searchall', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    const name = req.user.username;
    elastic.searchAll(name)
      .then((response) => {
        res.json({success: true, response: response.hits.hits})
      })
  });

  router.get('/mastersearch', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    // amity international school city montessori school
    const name = req.user.username;
    const message = ['Amity INTERNATIONAL SchOOL', 'JavA'];
    console.log(`"${message.join('" AND "')}"`); // OR AND
    elastic.masterSearch(name,`"${message.join('" AND "')}"`).then(function(response){
      res.json({success: true, response: response.hits.hits})
  },function(err){
      console.log(err);
  })
  });

  router.get('/search/keyword', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    const name = req.user.username;
    const message = {
      skills: ['jAvA'],
      education: ['Amity', 'Montessori'],
      achievement: [''],
      experience: [''],
      certification: ['icpcid'],
      projects: ['nodejs', 'angular']
    };
    
    elastic.searchByKeyword(name, message).then(function(response){
      res.json({success: true, response: response.hits.hits})
  },function(err){
      console.log(err);
  })
  });

  router.get('/search/phrase', passport.authenticate('jwt', {session: false}), (req, res) => {
    const name = req.user.username;
    const message = {
      skills: ['hata'],
      education: ['Delhi school of arts', 'ryans school'],
      achievement: [''],
      experience: [''],
    certification: ['icpcidhjjh'],
      projects: ['nodejsjhgds', 'angularsffdf']
    }
    elastic.searchByPhrase(name, message).then(function(response){
      res.json({success: true, response: response.hits.hits})
  },function(err){
      console.log(err);
  })
  });
  
  // @route GET /image/:filename
  // @desc Display Image
  router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if image
      if (file.contentType === 'application/pdf' || file.contentType === 'image/png'||file.contentType==='image/jpeg'||file.contentType==='image/jpg'||file.contentType==='application/msword'||file.contentType==='application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
       // for(const i=0;i<1;i++)
       res.header('Content-Type', file.contentType);
        console.log("AAAAAA"+readstream);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });
  
//   // @route DELETE /files/:id
//   // @desc  Delete file
//   app.delete('/files/:id', (req, res) => {
//     gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
//       if (err) {
//         return res.status(404).json({ err: err });
//       }
//       res.redirect('/');
//     });
//   });

module.exports = router;
