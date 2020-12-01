const Sequelize = require('sequelize');
const dbConfig = require('../config/database.json');

const File = require('../models/File');
const Location = require('../models/Location');

console.log("ENV", process.env);


const connection = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres'
});

File.init(connection);
Location.init(connection);

File.associate(connection.models);

module.exports = connection;