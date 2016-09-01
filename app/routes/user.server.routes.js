var users =require('../../app/controllers/users.server.controller');
var  passport = require("passport")
module.exports = function(app) {
    //app.route('/users').post(users.create).get(users.list);;

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
    
    //service to retrieve all users interseted in any event
    app.route('/users/Intevents/:userId')
        .get(users.intevents);
     //service to retrieve all users subs in any event
    app.route('/users/Subevents/:userId')
        .get(users.subevents);
 //service to retrieve all document made by a user
     app.route('/users/Subdocs/:userId')
        .get(users.subdocs);

    //service to get all users
    app.route('/users/allusers')
        .get(users.getall);

};