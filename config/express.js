
var config = require('./config'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport');

module.exports = function() {

    var app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());
    app.use(flash());
    app.use(methodOverride());
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.set('views', './public/views');
    app.set('view engine', 'ejs');

    app.use(express.static('./public'));

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/submission.document.server.routes.js')(app);
    require('../app/routes/submission.event.server.routes')(app);
    require('../app/routes/user.server.routes.js')(app);

    return app;
};
