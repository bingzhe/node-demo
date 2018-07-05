var http = require('http');
var qs = require('querystring');
var items = [];

var server = http.createServer((req, res) => {
    if (req.url === '/') {
        switch (req.method) {
            case 'GET':
                show(res);
                break;
            case 'POST':
                add(req, res);
                break;
            default:
                badRequest(res);
                break;
        }
    } else {
        notFound(res);
    }
});

server.listen(3000, '127.0.0.1', ()=>{
    console.log('Server is Start');
});

function show(res) {
    var html = '<h1>Todo List</h1>'
        + '<ul>'
        + items.map(item => {
            return '<li>' + item + '</li>';
        }).join('')
        + '</ul>'
        + '<form method="POST" action="/">'
        + '<p><input type="text" name="item" /></p>'
        + '<p><input type="submit" value="ADD Item" /></p>'
        + '</form>';

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

function notFound(res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
}

function add(req, res) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end("Bad Request");
}

function add(req, res) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
        body += chunk;
    });
    req.on('end', () => {
        var obj = qs.parse(body);
        items.push(obj.item);
        show(res);
    })

}