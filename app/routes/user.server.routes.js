var users =require('../../app/controllers/users.server.controller');
var  passport = require("passport")
module.exports = function(app) {
    //app.route('/users').post(users.create).get(users.list);;

    //----------
    app.route('/userreview/:userId').
    get(users.getAllReviews);

    //--


    app.route('/users/:userId').
    get(users.read).
    put(users.update).
    delete(users.delete);

    app.param('userId', users.userByID);
    app.get('/api/loggedIn',users.loggedIn);

    app.route('/signup')
        .get(users.renderSignup)
        .post(users.signup);

    app.route('/signin')
        .get(users.renderSignin)
        .post(passport.authenticate('local'),
            function(req, res) {
                // If this function gets called, authentication was successful.
                // `req.user` contains the authenticated user.
                // res.redirect('/users/' + req.user.username);
                if(req.user){
                    res.json({"user" : req.user});
                }else{
                    res.json({"user" : "invalid","error" : message});
                }
            });
    app.get('/signout', users.signout);


};