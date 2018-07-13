var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/photo_app');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("数据库连接成功！")
});

var schema = new mongoose.Schema({
    name: String,
    path: String
});

module.exports = db.model('Photo', schema);