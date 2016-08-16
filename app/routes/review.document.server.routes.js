var reviewerDocument =  require('../controllers/reviewer.document.server.controller.js');
module.exports = function(app) {
    app.route('/reviewer').
    post(reviewerDocument.create).
    get(reviewerDocument.list);


    app.route('/reviewer/:revDocumentId').
    get(reviewerDocument.read).
    put(reviewerDocument.update).
    delete(reviewerDocument.delete);

    app.param('revDocumentId', reviewerDocument.ReviewersDocumentByID);

};