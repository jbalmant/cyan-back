'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('users',
      [
        {
          name: 'admin',
          email: 'admin@cyan.com',
          password_hash: await bcrypt.hash('secret', 8),
          created_at: new Date(),
          updated_at: new Date()
        }
      ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
