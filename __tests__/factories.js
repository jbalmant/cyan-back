const faker = require('faker');
const { factory } = require('factory-girl');
const { File, User } = require('../src/app/models');
const FileStatus = require('../src/app/enums/FileStatus');

factory.define('User', User, {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date()
});

factory.define('File', File, {
    name: 'name',
    status: FileStatus.QUEUED,
    user_id: 1,
    url_path: 'path',
    createdAt: new Date(),
    updatedAt: new Date()
});

module.exports = factory;