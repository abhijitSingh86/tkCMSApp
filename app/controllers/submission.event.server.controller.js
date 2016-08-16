var SubmissionEvent = require("mongoose").model("SubmissionEvent");



exports.create = function(req, res, next) {
    var submissionEvent = new SubmissionEvent(req.body);
    submissionEvent.save(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(submissionEvent);
        }
    });
};

exports.list = function(req, res, next) {
    SubmissionEvent.find().populate('createdBy').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
        }
    });
};

exports.get = function(req, res, next) {
    SubmissionEvent.find().populate('createdBy').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
        }
    });
};


exports.read = function(req, res) {
    res.json(req.submissionEvent);
};
exports.submissionEventByID = function(req, res, next, id) {
    SubmissionEvent.findOne({
        _id: id
    }).populate('createdBy').exec(function(err, submissionEvent) {
        if (err) {
            return next(err);
        } else {
            req.submissionEvent = submissionEvent;
            next();
        }
    });
};

exports.update = function(req, res, next) {
    SubmissionEvent.findByIdAndUpdate(req.submissionEvent.id, req.body, function(err, submissionEvent) {
        if (err) {
            return next(err);
        } else {
            res.json(submissionEvent);
        }
    });
};

exports.delete = function(req, res, next) {
    req.submissionEvent.remove(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.submissionEvent);
        }
    })
};
