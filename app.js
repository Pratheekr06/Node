const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', adminRoutes.router);
app.use(shopRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.status(404);
    res.render('404', {pageTitle:'Page Not Found'});
});

app.listen(3000, () => {
    console.log('Server started');
});
