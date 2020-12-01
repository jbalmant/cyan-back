const Sequelize = require('sequelize');
const dbConfig = require('../config/database.json');

const File = require('../models/File');
const Location = require('../models/Location');

const connection = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    define: {
        timestamps: true,
        underscored: true
    }
});

File.init(connection);
Location.init(connection);

File.associate(connection.models);

module.exports = connection;