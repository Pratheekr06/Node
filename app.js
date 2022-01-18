const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.error(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', errorController.get404);
app.post('*', errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartItem});
Product.belongsToMany(Cart, { through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize.sync()
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        if(!user) return User.create({ name: 'Jack', email: 'jack@test.com'});
        else return Promise.resolve(user);
    })
    .then(user => {
        user.getCart()
        .then(cart => {
            if(!cart) user.createCart();
        })
    })
    .then(() => {
        app.listen(3000, () => {
            console.log('Server started');
        });
    })
    .catch(err => console.log(err));

