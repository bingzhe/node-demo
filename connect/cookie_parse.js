var connect = require('connect');
var cookieParser = require('cookie-parser');

var app = connect()
    .use(cookieParser('tobi is a cool ferret'))
    .use((req, res) => {
        res.end('hello \n');
    }).listen(3000);