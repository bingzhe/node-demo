// var Benchmark = require('benchmark');

// var suite = new Benchmark.Suite;

// var int1 = function (str) {
//     return +str;
// };

// var int2 = function (str) {
//     return parseInt(str, 10);
// };

// var int3 = function (str) {
//     return Number(str);
// };

// var number = '100';

// // add tests
// suite
//     .add('+', function () {
//         int1(number);
//     })
//     .add('parseInt', function () {
//         int2(number);
//     })
//     .add('Number', function () {
//         int3(number);
//     })
//     // add listeners
//     .on('cycle', function (event) {
//         console.log(String(event.target));
//     })
//     .on('complete', function () {
//         console.log('Fastest is ' + this.filter('fastest').map('name'));
//     })
//     // run async
//     .run({ 'async': true });

// var http = require('http');

// var server = http.createServer(requestHandler);
// function requestHandler(req, res){
//     res.end('hello visitor!');
// }
// server.listen(3000);

function parseBody(req, callback) {
    //http协议从req中解析body
    callback(null, body);
}

function checkIdInDatabase(body, ) {
    //根据body.id在database中检测，返回结果
    callback(null, dbResult);
}

function returnResult(dbResult, res) {
    if (dbResult && dbResult.length > 0) {
        res.end('true');
    } else {
        res.end('false');
    }
}

function requestHandler(req, res) {
    parseBody(req, function (err, body) {
        checkIdInDatabase(body, function (err, dbResult) {
            returnResult(dbResult, res);
        });
    });
}


var middlewares = [
    function fun1(req, res, next) {
        parseBody(req, function (err, body) {
            if (err) return next(err);
            req.body = body;
            next();
        });
    },
    function fun2(req, res, next) {
        checkIdInDatabase(req.body.id, function (err, rows) {
            if (err) return next(err);
            res.dbResult = rows;
            next();
        });
    },
    function fun3(req, res, next) {
        if (res.dbResult && res.dbResult.length > 0) {
            res.end('true');
        } else {
            res.end('false');
        }
        next();
    }
]

function requestHandler(req, res) {
    var i = 0;


    function next(err) {
        return res.end('error:', res.toString());
    }

    if (i < middlewares.length) {
        middlewares[i++](req, res, next);
    } else {
        return;
    }

    next();
}