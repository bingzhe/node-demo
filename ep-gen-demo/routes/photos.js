var photos = [];
var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var join = path.join;


photos.push({
    name: 'Node.js Logo',
    path: 'http://nodejs.org/images/logos/nodejs-green.png'
});
photos.push({
    name: 'Ryan Speaking',
    path: 'http://nodejs.org/images/ryan-speaker.jpg'
});

exports.list = (req, res, next) => {
    // res.render('photos', {
    //     title: 'Photos',
    //     photos: photos
    // });

    Photo.find({}, (err, photos) => {
        if (err) return next(err);
        res.render('photos', {
            title: 'photos',
            photos: photos
        });
    });
};

exports.form = (req, res) => {
    res.render('upload', {
        title: 'Photo upload'
    })
};


exports.submit = (dir) => {
    return (req, res, next) => {
        var img = req.file;
        var name = req.body.photo.name || img.originalname;
        // var path = join(dir, img.originalname);
        Photo.create({
            name: name,
            path: img.originalname
        }, err => {
            if (err) return next(err);
            res.redirect('/photos');
        });

        // fs.rename(img.originalname, path, err => {
        //     if (err) return next(err);

        //     Photo.create({
        //         name: name,
        //         path: img.name
        //     }, err => {
        //         if (err) return next(err);
        //         res.redirect('/');
        //     });
        // });
    };
};


exports.download = dir => {
    return (req, res, next) => {
        var id = req.params.id;
        console.log("下载", id);
        Photo.findById(id, (err, photo) => {
            if (err) return next(err);
            var path = join(dir, photo.path);

            // res.sendfile(path);
            res.download(path);
        });
    };
};