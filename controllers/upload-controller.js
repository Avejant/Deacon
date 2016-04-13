var mongoose = require('mongoose');
var multer = require('multer');
var uploadController = {};
var http = require('http');
var fs = require('fs');
var path = require('path');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, './uploads/attachments');
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, 'attachment' + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

var avatarStorage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, './uploads/avatars');
    },
    filename: function(req, file, cb) {
        var userId = req.user._id;
        var datetimestamp = Date.now();
        cb(null, userId + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

var avatar = multer({ //multer settings
    storage: avatarStorage
}).single('file');

uploadController.create = function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            res.json({
                error_code: 1,
                err_desc: err
            });
            return;
        }
        res.json({
            error_code: 0,
            filename: req.file.filename
        });
    });
}

uploadController.avatarUpload = function(req, res) {
    avatar(req, res, function(err) {
        if (err) {
            res.json({
                error_code: 1,
                err_desc: err
            });
            return;
        }
        req.user.avatar = req.file.filename;
        req.user.save(function(err) {
            if (err) {
                res.json({
                    error_code: 1,
                    err_desc: err
                });
                return;
            }
            res.json({
                error_code: 0,
                err_desc: null
            });
        });
    });
}

uploadController.download = function(req, res) {
    if (!req.user) {
        res.redirect('/');
    }
    var file = req.params.filename;
    var _path = path.resolve(".") + '/uploads/attachments/' + file;
    res.download(_path); // magic of download fuction
}
module.exports = uploadController;
