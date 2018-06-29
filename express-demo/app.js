const express = require('express');
const http = require('http');
const app = express();

app.get('/', (req, res) => {
    console.log(res);
    res.send('hello');
});

app.listen(3000, () => {
    console.log("Example app listening on port 3000!")
})