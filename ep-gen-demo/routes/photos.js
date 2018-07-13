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
        console.log(req);
        // var img = req.files.photo.image;
        // var name = req.body.photo.name || img.name;
        // var path = join(dir, img.name);
        // fa.rename(img.path, path, err => {
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