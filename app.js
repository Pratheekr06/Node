const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
require("dotenv").config();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('61f95dab55519dc213e5d3df');
        if (user) req.user = user;
        next();
    } catch(err) {
        console.error(err);
    }
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.use('*', errorController.get404);

const dbUrI = process.env.URI;
mongoose.connect(dbUrI);

const connection = mongoose.connection;
connection.once("open", async () => {
    console.log("Database connection established successfully");
    // const user = User({
    //     name: 'Test',
    //     email: 'test@test.com',
    //     cart: [],
    // });
    // await user.save();
    app.listen(3000, () => {
        console.log('Server started');
    });
});

connection.on('disconnected', () => {
    console.log('Database connection disconnected');
});