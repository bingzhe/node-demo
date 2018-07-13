const connect = require('connect');
var bodyParser = require('body-parser');

const app = connect()
    .use(bodyParser())
    .use((req, res) => {
        res.end("Resistered new user: " + req.body.username);
    }).listen(3000);