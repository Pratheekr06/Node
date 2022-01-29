const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const url = 'mongodb+srv://pratheek:password06@cluster0.h4byv.mongodb.net/shop?retryWrites=true&w=majority';
const mongoConnect = (callback) => {
    MongoClient.connect(url)
        .then(client => {
            console.log('Connected');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) return _db;
    throw 'No Database Found';
};

module.exports = {
    mongoConnect: mongoConnect,
    getDb: getDb,
};