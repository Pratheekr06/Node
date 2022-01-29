const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const User = require('./models/user');

const db = require('./util/database');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
    try {
        const user = await User.findbyId('61f264bf1b386f15b17d352d');
        if (user) req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    } catch(err) {
        console.error(err);
    }
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', errorController.get404);
app.post('*', errorController.get404);

db.mongoConnect(() => {
    app.listen(3000, () => {
        console.log('Server started');
    });
})
