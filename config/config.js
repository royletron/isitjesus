var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'isitjesus'
    },
    port: 3000,
    db: 'mongodb://isitjesus:lambch0p@ds053307.mongolab.com:53307/isitjesus'
  },

  test: {
    root: rootPath,
    app: {
      name: 'isitjesus'
    },
    port: 3000,
    db: 'mongodb://localhost/isitjesus-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'isitjesus'
    },
    port: 3000,
    db: 'mongodb://localhost/isitjesus-production'
  }
};

module.exports = config[env];
