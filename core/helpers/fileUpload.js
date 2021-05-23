const express = require('express'); // module
const path= require('path'); // module
const multer = require('multer'); // module
const utils = require('../helpers/utils'); // native

const fileStorage =  (imageDir) => {

    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `public/images/app/${imageDir}`);
      },
      filename: (req, file, cb) => {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {     // upload only png, jpeg and jpg format
          return cb(new Error('Please upload a Image'))
        }

        let token = utils.makeToken({label: 'AppPT'});
        
        cb(null, token + '_desktop' + path.extname(file.originalname) )
        cb(null, token + '_mobile' + path.extname(file.originalname) )
        req.token = token;
        req.imageExtension = path.extname(file.originalname);
      }
    })

}

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' 
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


exports.fileStorage = fileStorage;
exports.fileFilter = fileFilter;