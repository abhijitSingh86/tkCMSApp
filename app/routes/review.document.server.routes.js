var reviewerDocument =  require('../controllers/reviewer.document.server.controller.js');
var users =require('../../app/controllers/users.server.controller');

module.exports = function(app) {
    app.route('/review/:reviewerId').
    get(reviewerDocument.list).
    put(reviewerDocument.put);

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
    post(reviewerDocument.create).
    get(reviewerDocument.listAll);


    /*
     get the review for particular submission document id and user id
     {
     "submissionDocID" : ""
     }
     */
    app.route('/reviewForDocument/:userId').
        post(reviewerDocument.getReviewForASubDocument)

    //get the review for particular submission document id
    app.route('/review/getReviewForDocument/:subDocumentId').
    get(reviewerDocument.getReviewDetailForDocument);

    /*
     listOfReviews For User specific as per the request param
     */
    app.route('/getAllReviewForUser/:userId')
        .get(reviewerDocument.listOfReviewsForUser);



    app.param('reviewerId', reviewerDocument.reviewersDocumentByID);
    app.param('userId', users.userByID);
};