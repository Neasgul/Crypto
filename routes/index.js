var express = require('express');
var router = express.Router();
var fs  = require('fs');
var nodemailer = require('nodemailer');

var config 		= require('../utils/config');
var UserController 	= require('../controllers').UserController;
var ItemController 	= require('../controllers').ItemController;



/* GET home page. */

router.get('/', function(req, res, next) {
    if(req.cookies[config.cookie]!= undefined) {
        ItemController.getAllItemForUser(req.cookies[config.cookie],function (err, list) {
            res.render('home',{ filelist : list,user: req.cookies[config.cookie] ,connected : "true" });
        });
    } else {
        res.render('home',{ connected : "false" });
    }
});

router.get('/inscription',function (req, res, next) {
    res.render('inscription');
});

router.post('/inscription', function (req, res, next) {
    if(req.body.key != undefined) {
        if(req.body.email == undefined) {
            res.render('error');
        }
        UserController.getUserByEmail(req.body.email,function (error, user) {
            if(error) {
                res.render('error');
            }
            if(user.emailkey == req.body.key){
                res.cookie(config.cookie,user);
                res.redirect('/')
            }
        })
    } else if(req.body.email == undefined || req.body.password == undefined){
        res.render('error');
    }else {
        UserController.createUser(req, function (error, created) {
            if(error) {
                res.render('error');
            }
            sendEmail(created);
            res.render('postinscription');
        });
    }
});

router.get('/connexion', function (req, res, next) {
    res.render('connexion');
});

router.post('/connexion', function (req, res, next) {
    if(req.body.email == undefined || req.body.password == undefined){
        res.render('error');
    }else {
        UserController.getUserByEmail(req.body.email,function (err, user) {
            if(err) {
                res.render('error');
            }
            if(user && user.password==req.body.password) {
                res.cookie(config.cookie,user);
                res.redirect('/')
            }
        })
    }
});

router.get('/deconnexion', function (req, res, next) {
    res.clearCookie(config.cookie);
    res.redirect('/');
});

router.get('/download/:filename', function (req, res, next) {
    var file = __dirname+'/../cryptedDoc/'+req.params.filename;
    res.download(file)
});

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(files[i]);
        }
    }
    return files_;
}

function sendEmail(user) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'project.crypto.document@gmail.com',
            pass: 'ProjectCrypto'
        }
    });

    var mailOptions = {
        from: 'project.crypto.document@gmail.com',
        to: user.email,
        subject: 'Account Verification',
        text: 'Your verification key is '+user.emailkey
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}

module.exports = router;
