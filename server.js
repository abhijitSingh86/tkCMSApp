
//It is adviced to use NODE_ENV in machine... so for linux  export NODE_ENV=production
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('./config/mongoose');
var express = require('./config/express');
var passport = require('./config/passport');
var db = mongoose();
var app = express();
var passport = passport();

app.listen(3000);
console.log('Server running at http://localhost:3000/');
module.exports = app;

