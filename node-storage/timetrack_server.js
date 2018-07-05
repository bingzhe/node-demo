var http = require('http');
var work = require('./lib/timetrack');
var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'bdm256143682.my3w.com',
    user: 'bdm256143682',
    password: '',
    database: 'bdm256143682_db',
    insecureAuth: true
});

var server = http.createServer((req, res) => {
    switch (req.method) {
        case 'POST':
            switch (req.url) {
                case '/':
                    work.add(db, req, res);
                    break;
                case '/archive':
                    work.archive(db, req, res);
                    break;
                case '/delete':
                    work.delete(db, req, res);
                    break;
            }
            break;
        case "GET":
            switch (req.url) {
                case '/':
                    work.show(db, res);
                    break;
                case '/archived':
                    work.showArchived(db, res);
            }
            break;
    }
});

db.query(
    "CREATE TABLE IF NOT EXISTS work ("
    + "id INT(10) NOT NULL AUTO_INCREMENT, "
    + "hours DECIMAL(5,2) DEFAULT 0, "
    + "date DATE, "
    + "archived INT(1) DEFAULT 0, "
    + "description LONGTEXT, "
    + "PRIMARY KEY(id))",
    function (err) {
        if (err) throw err;
        console.log("server started...");
        server.listen(3000, '127.0.0.1');
    }
)

// db.connect(err => {
//     if (err) {
//         console.log(err);
//         return;
//     }
// })

// db.query('SELECT * from wpb_posts', function (error, results, fields) {
//     if (error) throw error;
//     for (var i = 0; i < results.length; i++) {
//         console.log('The results is: ' + JSON.stringify(results[i].post_title, null, 2));
//     }
// });