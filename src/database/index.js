const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const File = require('../models/File');
const Location = require('../models/Location');

const connection = new Sequelize(dbConfig);


File.init(connection);
Location.init(connection);

File.associate(connection.models);

module.exports = connection;