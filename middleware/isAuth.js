
exports.isAuth = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (!req.session.isAuthenticated || !req.session.isAdmin) return res.redirect('/request-access');
    next();
}