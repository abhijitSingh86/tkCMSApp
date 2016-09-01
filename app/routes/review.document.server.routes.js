var reviewerDocument =  require('../controllers/reviewer.document.server.controller.js');
var users =require('../../app/controllers/users.server.controller');

module.exports = function(app) {
    app.route('/reviewer/:reviewerId').
    get(reviewerDocument.list);

    /*
    POST to create a review in database
     {
     "createdBy" : "57b36080ae1fdc161aecc1cd",
     "comments" : "very nice docu",
     "reviewerExpertise":1.0,
     "overallEval":1.0,
     "summary":"superb",
     "majorStrongPoints":"everything",
     "majorWeakPoints":"none",
     "submissionDocId":"57c831b86f6555c13602aa62"

     }
     */
    app.route('/reviewer').
    put(reviewerDocument.put).
    post(reviewerDocument.create);


    /*
     get the review for particular submission document id
     {
     "submissionDocID" : ""
     }
     */
    app.route('/reviewForDocument/:userId').
        post(reviewerDocument.getReviewForASubDocument)

    app.route('/reviewer/getreviewer/:subDocumentId').
    get(reviewerDocument.getDetails);

    app.param('reviewerId', reviewerDocument.reviewersDocumentByID);
    app.param('userId', users.userByID);
};