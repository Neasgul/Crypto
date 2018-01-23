var express = require('express');
var router = express.Router();
var fs  = require('fs');
var crypto = require("crypto");
var path = require("path");
var nodemailer = require('nodemailer');
var cryptico = require('cryptico-js');
var passwordValidator = require('password-validator');


var config 		= require('../utils/config');
var UserController 	= require('../controllers').UserController;
var ItemController 	= require('../controllers').ItemController;

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
    /*var schema = new passwordValidator();
    schema
    .is().min(8)
    .has().uppercase()
    .has().lowercase() 
    .has().digits()
    //.has().symbols()
    .has().not().spaces();*/

    if(req.body.key != undefined) {
        if(req.body.email == undefined) {
            res.render('error',{status:null , errmsg: 'le champ email doit contenir un email valide'});
        }
        UserController.getUserByEmail(req.body.email,function (error, user) {
            if(error) {
                res.render('error',{status:null, errmsg : 'le champ email doit contenir un email valide'});
            }
            if(user.emailkey == req.body.key){
                res.cookie(config.cookie,user);
                res.redirect('/')
            } else{
                res.render('error',{status:null, errmsg: 'le champ key doit contenir la clé envoyé par email'});
            }
        })
    } else if(req.body.email == "" || req.body.password =="" || req.body.publickey == ""){
        console.log('debug');
        res.render('error',{status:null, errmsg: 'le champ email doit contenir un email valide et / ou le mot de passe doit avoir 8 caractères minimum, 1 majuscule, 1 minuscule, 1 caractère spécial et / ou le champ clé public doit contenir une clé public'});
    } else {
        UserController.createUser(req, function (error, created) {
            if(error) {
                res.render('error', {status:null, errmsg:"erreur lors de la creation de l'utilisateur"});
            }
            //console.log(created);
            sendEmail(req, created);
            res.render('postinscription');
        });
    }
});

router.get('/connexion', function (req, res, next) {
    res.render('connexion');
});

router.post('/connexion', function (req, res, next) {
    if(req.body.email == undefined || req.body.password == undefined){
        res.render('error',{status:null, errmsg : 'le champ email doit contenir un email valide et / ou un mot de passe doit ere saisi'});
    }else {
        UserController.getUserByEmail(req.body.email,function (err, user) {
            if(err) {
                res.render('error',{status:null,errmsg : 'le champ email doit contenir un email valide'});
            }
            var hash = crypto.createHash('sha256').update(req.body.password).digest('base64');            
            if(user && user.password==hash) {
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

function sendEmail(req,user) {    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'project.crypto.document@gmail.com',
            pass: 'ProjectCrypto'
        }
    });

    
    var pubkey = '-----BEGIN PUBLIC KEY-----\n'+
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXkZncmuYgzFUp4IcibKVsphfM\n'+
    'tDl0EIr7Zs72b5zKOxKulrBetyU6WZl/5upIheZs3BpZdeD+na7ROwH3tMn+ENsd\n'+
    '+/nfRe220wRdjU+8lTzOgxoD7YViQtmpAwxO91MkbHbEe/la294GBUaclrdWpwnB\n'+
    'YoT1HBXn9uPK161kIwIDAQAB\n'+
    '-----END PUBLIC KEY-----';

    console.log(pubkey);
    console.log(req.body.publickey);
    var encryptStringWithRsaPublicKey = function(toEncrypt, publicKey) {
        var buffer = new Buffer(toEncrypt);
        var encrypted = crypto.publicEncrypt(publicKey, buffer);
        return encrypted.toString("base64");
    };

    //var msg = encryptStringWithRsaPublicKey("bob", pubkey);
   var msg =encryptStringWithRsaPublicKey('Your verification key is '+user.emailkey, req.body.publickey) ;
    console.log('msg '+msg);
    var mailOptions = {
        from: 'project.crypto.document@gmail.com',
        to: user.email,
        subject: 'Account Verification',
        text: msg
    };

    //transporter.use('stream', openpgpEncrypt());    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('error' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}


module.exports = router;
