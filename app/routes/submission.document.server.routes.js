var submissionDocument =  require('../controllers/submission.document.server.controller.js');
module.exports = function(app) {

    app.route('/upload').
    post(submissionDocument.upload);

    app.route('/subDocument').
    post(submissionDocument.create).
    get(submissionDocument.list);


    app.route('/subDocument/:subDocumentId').
    get(submissionDocument.read).
    put(submissionDocument.update).
    delete(submissionDocument.delete);

    /*
     listOfSubmissionDocumentForUserAndEvent
     {
     "userId" : 
     "submissionEventId":
     }
     */
    app.route('/subDocumentByEventId')
        .post(submissionDocument.listOfSubmissionDocumentForUserAndEvent);

    /*
     listOfSubmissionDocumentForUser
     {
     "userId" : 
     
     }
     */
    app.route('/subDocumentByUserId')
        .post(submissionDocument.listOfSubmissionDocumentForUser);

    app.route('/listOfAllSubmissionDocsForEvent/:eventId').
    get(submissionDocument.listOfAllSubmissionsForEvent);

    app.param('subDocumentId', submissionDocument.submissionDocumentByID);

};