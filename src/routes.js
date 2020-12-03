const FileController = require('./app/controllers/FileController');
const LocationController = require('./app/controllers/LocationController');

const routes = require('express').Router();

const authMiddleware = require ('./app/middlewares/auth');

const SessionController = require('./app/controllers/SessionController');

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/files', FileController.list);
routes.post('/files', FileController.store);

// TODO (jbalmant) - Implement auth

// routes.post('/files', FileController.store);
// routes.get('/files', FileController.list);
// routes.get('/files/:file_id/locations', LocationController.list);

module.exports = routes;