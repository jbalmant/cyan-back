const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const File = require('../models/File');
const Location = require('../models/Location');

let connection = null

if (process.env.DATABASE_URL) {
    connection = new Sequelize(process.env.DATABASE_URL, {
        dialect:  'postgres',
        protocol: 'postgres',
        port:     match[4],
        host:     match[3],
        logging:  true //false
      })
} else {
    connecttion = new Sequelize(dbConfig);
}

File.init(connection);
Location.init(connection);

File.associate(connection.models);

module.exports = connection;