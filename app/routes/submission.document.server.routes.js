var submissionDocument =  require('../controllers/submission.document.server.controller.js');
var users =require('../../app/controllers/users.server.controller');
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
    
    app.route('/subDocument/:userId/:subDocId').
        post(submissionDocument.download);
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

    // app.route('/listOfAllReviewsForSubmissionDocument/:subDocumentId').
    // get(submissionDocument.listOfAllReviewsForSubmissionDocument);


    app.param('subDocumentId', submissionDocument.submissionDocumentByID);
   

};