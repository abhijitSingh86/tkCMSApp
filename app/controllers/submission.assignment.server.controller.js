var SubmissionDocument = require("mongoose").model("SubmissionDocument");



exports.create = function(req, res, next) {
    var submissionEvent = new SubmissionDocument(req.body);
    submissionEvent.save(function(err) {
        if (err) {
            console.log(err)
            return next(err);
        } else {
            res.json(submissionEvent);
        }
    });
};

