const FileController = require('./app/controllers/FileController');

const routes = require('express').Router();

const authMiddleware = require ('./app/middlewares/auth');

const SessionController = require('./app/controllers/SessionController');

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/files', FileController.list);
routes.get('/files/:id', FileController.get);
routes.post('/files', FileController.store);

module.exports = routes;