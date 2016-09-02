var SubmissionEventSchema =  require('../controllers/submission.event.server.controller.js');
var submissionDocument =  require('../controllers/submission.document.server.controller.js');
var users =require('../../app/controllers/users.server.controller');
var  passport = require("passport")
module.exports = function(app) {
    app.route('/subEvents').
    post(SubmissionEventSchema.create).
    get(SubmissionEventSchema.list);


    app.route('/subEvent/:subEventId').
        get(SubmissionEventSchema.read).
        put(SubmissionEventSchema.update).
        delete(SubmissionEventSchema.delete);

    /*
    service to add a list of users in the event's interested list
     {
     "interestedUsers" : ["57b34b48ae1fdc161aecc1cb","57b36080ae1fdc161aecc1cd"]
     }
     */
    app.route('/subEvent/addtointeresteduserlist/:subEventId')
        .put(SubmissionEventSchema.addToInterestedUserList)
        .delete(SubmissionEventSchema.deleteFromInterestedUserList);

    /*
        to retrieve a list of accepted and not yet accepted user list for authors
        based on event
     */
    app.route('/subEvent/retrieveApprovedAuthorsToEvent/:subEventId')
        .get(SubmissionEventSchema.retrieveApprovedAuthorsToEvent);

    app.param('subEventId', SubmissionEventSchema.submissionEventByID);
    app.param('userId', users.userByID);

    app.route('/subEvent/getInterestedReviewers/:subEventId').
    get(SubmissionEventSchema.retrieveInterestedReviewersForEvent);

    app.route('/subEvent/getInterestedReviewersForDocument/:subDocumentId').
    get(SubmissionEventSchema.retrieveInterestedReviewersForDocument);


    app.route('/subEvent/getInterestedAuthors/:subEventId').
    get(SubmissionEventSchema.retrieveAuthorsToEvent);

    app.param('subDocumentId', submissionDocument.submissionDocumentByID);
};