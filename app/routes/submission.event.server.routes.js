var SubmissionEventSchema =  require('../controllers/submission.event.server.controller.js');
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

    app.param('subEventId', SubmissionEventSchema.submissionEventByID);


    app.route('/subEvent/getReviewers/:subEventId').
    get(SubmissionEventSchema.retrieveReviewersForEvent);


    app.route('/subEvent/getAuthors/:subEventId').
    get(SubmissionEventSchema.retrieveAuthorsToEvent);

};