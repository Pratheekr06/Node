const path = require('path');
require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const app = express();
const store = new MongoDbStore({
    uri: process.env.URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 12
})
const csrfProtection = csrf();

const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'mySecret', saveUninitialized: false, resave: false, store: store}));

app.use(async (req, res, next) => {
    if (req.session && req.session.isAuthenticated && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);
            if (user) req.user = user;
            next();
        } catch(err) {
            console.error(err);
        }
    } else {
        next();
    }
});

app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.csrfToken = req.csrfToken();
    next();
})
app.use(flash());

// app.use((req, res, next) => {
//     try {
//         const cookies = req.get('Cookie').split(';');
//         res.locals.isAuthenticated = false;
//         if (cookies.includes(' isAuthenticated=true')) {
//             res.locals.isAuthenticated = true;
//         }
//         next();
//     } catch(err) {
//         console.error(err);
//     }
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use('*', errorController.get404);

app.use((error, req, res, next) => {
    res.redirect('/500');
})

const dbUrI = process.env.URI;
mongoose.connect(dbUrI);

const connection = mongoose.connection;
connection.once("open", async () => {
    console.log("Database connection established successfully");
    app.listen(3000, () => {
        console.log('Server started');
    });
});

connection.on('disconnected', () => {
    console.log('Database connection disconnected');
});