const faker = require('faker');
const { factory } = require('factory-girl');
const { File, Location, User } = require('../src/app/models');
const FileStatus = require('../src/app/enums/FileStatus');

factory.define('User', User, {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date()
});

factory.define('File', File, {
    name: faker.name.findName(),
    status: FileStatus.QUEUED,
    user_id: 1,
    url_path: faker.internet.url(),
    createdAt: new Date(),
    updatedAt: new Date()
});


factory.define('Location', Location, {
    file_id: 1,
    point: {type: 'Point', coordinates: [-6.5847,-51.4006]},
    createdAt: new Date(),
    updatedAt: new Date()
});

module.exports = factory;