const express = require('express');
const FileController = require('./controllers/FileController');
const LocationController = require('./controllers/LocationController');

const routes = express.Router();

// TODO (jbalmant) - Implement auth

routes.post('/files', FileController.store);
routes.get('/files', FileController.list);

routes.get('/files/:file_id/locations', LocationController.list);

module.exports = routes;