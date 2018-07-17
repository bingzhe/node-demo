var User = require('../lib/user');

exports.form = function (req, res) {
    res.render('login', { title: 'Login' });
};

exports.submit = (req, res, next) => {
    var data = req.body;

    User.authenticate(data.username, data.password, (err, user) => {
        if (err) return next(err);

        if (user) {
            req.session.uid = user.id;
            res.redirect('/login');
        } else {
            res.error('sorry! invalid credentials.');
            res.redirect('back');
        }
    });
    console.log(req.body);
};