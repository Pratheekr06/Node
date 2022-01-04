const path = require("path/posix");

exports.get404 = (req, res) => {
    res.status(404);
    res.render('404', {pageTitle:'Page Not Found' , path:'/'});
};