const User = require('../lib/user');

exports.form = (req, res) => {
    res.render('register', { title: "Register" });
};

exports.submit = (req, res, next) => {
    let data = req.body;
    console.log(data);

    User.getByName(data.username, (err, user) => {
        if (err) return next(err);

        if (user.id) {
            res.send("Username already taken!");
            // res.redirect('back');
        } else {
            user = new User({
                name: data.username,
                pass: data.password
            });

            user.save(err => {
                if (err) return next(err);
                //存cookie
                // req.session.uid = user.id;
                res.cookie('uid', user.id);
                res.redirect('/login');
            })
        }
    });

};