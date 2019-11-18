require('rootpath')();

const debug = require('debug')('server:debug');

const express = require('express');
const config = require('config');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(jwt());

app.use('/youtube', require('./youtube/youtube.controller'));

app.use(errorHandler);

const server = app.listen(config.get('port'), () => {
    debug(`Server is running on port ${config.get('port')} and in ${config.get('name')} mode`);
});

module.exports = app;
module.exports.port = server.address().port;
