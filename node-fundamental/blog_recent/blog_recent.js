var http = require('http');
var fs = require('fs');

http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('./titles.json', (err, data) => {
            if (err) {
                console.error(err);
                res.end('Server Error');
            } else {
                var titles = JSON.parse(data.toString());

                fs.readFile('./template.html', (err, data) => {
                    if (err) {
                        console.error(err);
                        res.end('Server Error');
                    } else {
                        var tmpl = data.toString();

                        var html = tmpl.replace('%', titles.join('</li><li>'));
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(html);
                    }
                });
            }
        });
    }
}).listen(3000, () => {
    console.log('Server listening on port 3000');
});
