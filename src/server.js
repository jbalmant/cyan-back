const express = require('express');
const routes = require('./routes');
const cors = require('cors');

require('./database');

const app = express();

app.use(cors())
app.use(express.json());
app.use(routes);

global.__basedir = __dirname;

app.listen(process.env.PORT || 5000);
