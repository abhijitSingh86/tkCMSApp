var submissionDocument =  require('../controllers/submission.document.server.controller.js');
var users =require('../../app/controllers/users.server.controller');
module.exports = function(app) {

    // Upload the file as userid_eventidsubmisson.pdf
    app.route('/upload').
    post(submissionDocument.upload);

    //Create a new submission document, get list of all document
    app.route('/subDocument').
    post(submissionDocument.create).
    get(submissionDocument.list);

    //Read the details of document, update the document, delete a document.
    app.route('/subDocument/:subDocumentId').
    get(submissionDocument.read).
    put(submissionDocument.update).
    delete(submissionDocument.delete);

    //download a file
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


    //list Of AllSubmissionDocs For an Event
    app.route('/listOfAllSubmissionDocsForEvent/:eventId').
    get(submissionDocument.listOfAllSubmissionsForEvent);

    // app.route('/listOfAllReviewsForSubmissionDocument/:subDocumentId').
    // get(submissionDocument.listOfAllReviewsForSubmissionDocument);


    app.param('subDocumentId', submissionDocument.submissionDocumentByID);
   

};