var submissionDocument =  require('../controllers/submission.document.server.controller.js');
module.exports = function(app) {
    app.route('/subDocument').
    post(submissionDocument.create).
    get(submissionDocument.list);


    app.route('/subDocument/:subDocumentId').
    get(submissionDocument.read).
    put(submissionDocument.update).
    delete(submissionDocument.delete);

    app.param('subDocumentId', submissionDocument.submissionDocumentByID);

};