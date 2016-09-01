var users =require('../../app/controllers/users.server.controller');
var  passport = require("passport")
module.exports = function(app) {
    //app.route('/users').post(users.create).get(users.list);;

    //----------

    app.route('/userreview/:userId').
    get(users.getAllReviews);

    /*
    retrieve all the submission document list which are assigned to the user for review
     */
    app.route('/user/review/:userId').
    get(users.getAssignedReviews);

    /*
    revtrieve all the submission event assigned to the user
     */
    app.route('/user/submission/:userId').
    get(users.getAssignedSubmissions);

    /*
    assign a event to list of user
     {
     "submissionEventId" : "57bd32b07be70f7930dd30b6",
     "users" : [ "57b36080ae1fdc161aecc1cd" ,"57b34b48ae1fdc161aecc1cb"]
     }

     */
    app.route('/assignEventToUsers/').
    put(users.subscribeUserToEvent);
    /*
     assign a document to list of user for review
     {
     "submissionDocumentId" : "57c831b86f6555c13602aa62",
     "users" : [ "57b36080ae1fdc161aecc1cd" ,"57b34b48ae1fdc161aecc1cb"]
     }
    */
        app.route('/assignDocumentToUsersReview').
        put(users.subscribeReviewerToEvent);
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