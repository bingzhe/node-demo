var express = require('express');
var res = express.response;

res.message = (msg, type) => {
    type = type || 'info';
    var sess = this.req.session;
    sess.message = sess.messages || [];
    sess.messages.push({ type: type, string, msg })
}
