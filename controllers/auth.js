const User = require('../models/user');

exports.getLogin = async (req, res, next) => {
    res.render('auth/login', {pageTitle: 'Login', path: '/login', isAuthenticated: req.session.isAuthenticated});
};

exports.postLogin = async (req, res, next) => {
    try {
        const user = await User.findById('61f95dab55519dc213e5d3df');
        if (user) {
            req.session.userId = user._id;
            req.session.isAuthenticated = true;
            req.session.save(err => {
                console.log(err);
                res.redirect('/');
            });
        }
    } catch(err) {
        console.error(err);
    }
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/');
    });
}