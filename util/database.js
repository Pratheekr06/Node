const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('node-app', 'root', 'Dre@mmate06', { dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;