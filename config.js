// config

const path = require('path');

const host = 'localhost';

const port = 3000;

const logLevel = 'debug';

const assetsPath = path.join(__dirname, './assets');

const swaggerPath = '/swagger';

const swaggerSpecPath = '/swagger.json';

// mysql config

const mysqlConfig = {
    host: "localhost",
    user: "idiom",
    password: "idiom",
    port: 3306
}

// mongodb config

const mongodbUrl = 'mongodb://127.0.0.1:27017'

module.exports = {
    logLevel,
    port,
    assetsPath,
    swaggerPath,
    swaggerSpecPath,
    mysqlConfig,
    mongodbUrl
}
