var qs = require('querystring');

//发送html响应
exports.sendHtml = function (res, html) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
};

//解析http Post数据
exports.parseReceivedData = function (req, cb) {
    var body = "";
    req.setEncoding('utf8');
    req.on('data', chunk => {
        body += chunk;
    });
    req.on('end', () => {
        var data = qs.parse(body);
        cb(data);
    });
};

exports.actionForm = function (id, path, label) {
    var html = `
        <form method="POST" action=${path} >
            <input type="hidden" name="id" value=${id} />
            <input type="submit" value=${label} />
        </form>
    `;

    return html;
};

//添加工作记录
exports.add = function (db, req, res) {
    exports.parseReceivedData(req, work => {
        db.query(
            `INSERT INTO work (hours, date, description) VALUES (?, ?, ?)`,
            [work.hours, work.date, work.description],
            err => {
                if (err) throw err;
                exports.show(db, res);
            }
        )
    });
};

//删除工作记录
exports.delete = function (db, req, res) {
    exports.parseReceivedData(req, work => {
        db.query(
            `DELETE FROM work WHERE id=?`,
            [work.id],
            err => {
                if (err) throw err;
                exports.show(db, res);
            }
        )
    });
};


//归档
exports.archive = function (db, req, res) {
    exports.parseReceivedData(req, work => {
        db.query(
            `UPDATE work SET archived=1 WHERE id=?`,
            [work.id],
            err => {
                if (err) throw err;
                exports.show(db, res);
            })
    });
};

exports.show = function (db, res, showArchived) {
    var query = `SELECT * FROM work WHERE archived=? ORDER BY date DESC`;
    var archiveValue = (showArchived) ? 1 : 0;

    db.query(
        query,
        [archiveValue],
        (err, rows) => {
            if (err) throw err;
            html = (showArchived) ?
                "" :
                '<a href = "/archived"> Archived Work </a> <br />';

            html += exports.workHitlistHtml(rows);
            html += exports.workFormHtml();

            exports.sendHtml(res, html);
        }
    );
};

exports.showArchived = function (db, res) {
    exports.show(db, res, true);
};


exports.workHitlistHtml = function (rows) {

    rows = rows.map(item => {
        item.datestr = TimeTo(item.date);
        return item;
    })
    var html = '<table cellspacing="0" cellpadding="0">';
    for (const i in rows) {
        if (rows.hasOwnProperty(i)) {
            html += `<tr>`;
            html += `<td style="border:1px solid #eee; padding: 2px 10px;">${rows[i].id}</td>`;
            html += `<td style="border:1px solid #eee; padding: 2px 10px;">${rows[i].archived}</td>`;
            html += `<td style="border:1px solid #eee; padding: 2px 10px;">${rows[i].datestr}</td>`;
            html += `<td style="border:1px solid #eee; padding: 2px 10px;">${rows[i].hours}</td>`;
            html += `<td style="border:1px solid #eee; padding: 2px 10px;">${rows[i].description}</td>`;
            if (!rows[i].archived) {
                html += '<td style="border:1px solid #eee; padding: 2px 10px;">' + exports.workArchiveForm(rows[i].id) + '</td>';
            }
            html += '<td style="border:1px solid #eee; padding: 2px 10px;">' + exports.workDeleteForm(rows[i].id) + '</td>'
            html += '</tr>';
        }
    }
    html += '</table>';

    return html;
};

exports.workFormHtml = function () {
    var html = `
        <form method="POST" action="/">
            <p>Date (YYYY-MM-DD):<br/><input name="date" type="text"/></p>
            <p>Hours worked:<br/><input name="hours" type="text"/></p>
            <p> Description:<br/>   
                <textarea name="description"></textarea>
                <input type="submit" value="Add"/>
        </form>
    `
    return html;
};

exports.workArchiveForm = function (id) {
    return exports.actionForm(id, '/archive', 'Archive');
};

exports.workDeleteForm = function (id) {
    return exports.actionForm(id, '/delete', 'Delete');
}

function TimeTo(timestamp, format) {
    // var t = timestamp > 0 ? new Date(timestamp * 1000) : new Date();
    var t = new Date(timestamp);
    var o = {
        "M+": t.getMonth() + 1,                      //月份
        "d+": t.getDate(),                           //日
        "h+": t.getHours(),                          //小时
        "m+": t.getMinutes(),                        //分
        "s+": t.getSeconds(),                        //秒
        "q+": Math.floor((t.getMonth() + 3) / 3),    //季度
        "S": t.getMilliseconds()                     //毫秒
    };
    var fmt = format || "yyyy-MM-dd hh:mm:ss";
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (t.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}