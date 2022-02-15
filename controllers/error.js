const path = require("path");

exports.get404 = (req, res) => {
    res.status(404);
    res.render('404', {pageTitle:'Page Not Found' , path:'*', isAuthenticated: req.session.isAuthenticated});
};

exports.get500 = (req, res) => {
    res.status(500);
    res.render('500', {pageTitle:'Server Error' , path:'/500', isAuthenticated: req.session.isAuthenticated});
};