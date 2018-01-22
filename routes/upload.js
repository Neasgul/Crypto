var express = require('express');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var ItemController 	= require('../controllers').ItemController;
var config 		= require('../utils/config');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('upload');
});

router.post('/',function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.keepExtensions = true;
  form.uploadDir = config.dir;
  form.parse(req, function (err, fields, files) {
    if (err) return res.status(500).json({ error: err })
    res.status(200).json({ uploaded: true })
  });
  form.on('file', function (name, file) {
    const [fileName, fileExt] = file.name.split('.')
    file.path = path.join(config.dir, `${fileName}.${fileExt}`)

      fs.writeFile(file.path, file, function(err) {
          var user = req.cookies[config.cookie];
          ItemController.createItem(file,user,function (error, success) {

          })

      });
  })
});

module.exports = router;
