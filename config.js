// config

const path = require('path');

const host = 'localhost';

const port = 3000;

const logLevel = 'debug';

const assetsPath = path.join(__dirname, './assets');

const swaggerPath = '/swagger';

const swaggerSpecPath = '/swagger.json';

module.exports = {
    logLevel,
    port,
    assetsPath,
    swaggerPath,
    swaggerSpecPath
}
