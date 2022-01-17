const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const db = require('./util/database');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', errorController.get404);
app.post('*', errorController.get404);

app.listen(3000, () => {
    console.log('Server started');
});
