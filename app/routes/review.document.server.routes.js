var reviewerDocument =  require('../controllers/reviewer.document.server.controller.js');
module.exports = function(app) {
    app.route('/reviewer/:reviewerId').
    get(reviewerDocument.list);

    app.route('/reviewer').
    put(reviewerDocument.put);

    app.route('/reviewer/getreviewer/:subDocumentId').
    get(reviewerDocument.getDetails);

    app.param('reviewerId', reviewerDocument.reviewersDocumentByID);

};