var SubmissionEventSchema =  require('../controllers/submission.event.server.controller.js');
module.exports = function(app) {
    app.route('/subEvents').
    post(SubmissionEventSchema.create).
    get(SubmissionEventSchema.list);


    app.route('/subEvent/:subEventId').
    get(SubmissionEventSchema.read).
    put(SubmissionEventSchema.update).
    delete(SubmissionEventSchema.delete);

    app.param('subEventId', SubmissionEventSchema.submissionEventByID);

};