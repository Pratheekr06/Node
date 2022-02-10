const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const user = require('../models/user');

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b0f7dc02f3b1c4",
      pass: "b02ff7af165faf"
    }
});

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: req.flash('error')
    });
};

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'Invalid Email')
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    req.session.userId = user._id;
                    req.session.isAuthenticated = true;
                    return req.session.save(err => {
                        if (err) throw err;
                        res.redirect('/');
                    });
                }
                else {
                    req.flash('error', 'Invalid Password')
                    return res.redirect('/login');
                }
            })
            .catch(err => console.error(err))
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

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
    });
  };

exports.postSignup = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    // User.findOne({ email })
    //     .then(user => {
    //         if (user) {
    //             return res.redirect('/login');
    //         }
    //         return bcrypt.hash(password, 12)
    //     })
    //     .then(hashedPassword => {
    //         const userDoc = User({
    //             name: name,
    //             email: email,
    //             password: hashedPassword
    //         });
    //         return userDoc.save();
    //     })
    //     .then(() => {
    //         res.redirect('/');
    //     })
    //     .catch(err => console.error(err))
    try {
        const user = await User.findOne({email});
        if (user) {
            req.flash('error', 'User already exist, Please Login');
            res.redirect('/login');
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 12)
            const userDoc = User({
                name: name,
                email: email,
                password: hashedPassword
            });
            await userDoc.save();
            res.redirect('/login')
            transport.sendMail({
                to: email,
                from: 'shop@node.com',
                subject: 'Sigup Successful!!',
                html: '<h1>Thank you for Signing Up</h1>'
            })
        }
    } catch(err) {
        console.error(err);
    }
};

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle: 'Reset',
        path: '/reset',
        errorMessage: req.flash('error')
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err)  return res.redirect('/reset');
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with the email found');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save()
                .then(() => {
                    res.redirect('/');
                    transport.sendMail({
                        to: req.body.email,
                        from: 'shop@node.com',
                        subject: 'Password Reset Request',
                        html: `
                            <p>Your request to reset password</p>
                            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                        `
                    })
                })
                .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    })
}

exports.getNewPassword = async (req, res, next) => {
    const token = req.params.token;
    try {
        const user = await User.findOne({resetToken: token, resetTokenExpiration: { $gt: new Date() }});
        res.render('auth/new-password', {
            pageTitle: 'New Password',
            path: '/new-password',
            errorMessage: req.flash('error'),
            userId: user ? user._id.toString() : '',
            passwordToken: token,
        })
    } catch (err) {
        console.error(err);
    }
}

exports.postNewPassword = async (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    try {
        const user = await User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: new Date() },
            _id: userId,
        })
        if (!user) {
            res.flash('error', 'User not found');
            return res.redirect('/login');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        user.password = hashedPassword;
        await user.save();
        res.redirect('/login');
    } catch(err) {
        console.error(err);
    }
}