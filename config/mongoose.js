var config = require('./config'),
    mongoose = require('mongoose');
module.exports = function() {
    var db = mongoose.connect(config.db);
    require('../app/models/user.server.model');
    require('../app/models/submission.event.server.model.js');
    require('../app/models/submission.document.server.model.js');
    return db;
};