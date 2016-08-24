var SubmissionEvent = require("mongoose").model("SubmissionEvent");
var user = require("../controllers/users.server.controller.js");


exports.create = function(req, res, next) {
    if(req.user && user.isChair(req)) {
        var submissionEvent = new SubmissionEvent(req.body);
        submissionEvent.createdBy = req.user._id;

        if(submissionEvent.start_date < submissionEvent.end_date) {
            res.json({"error": "Start date can't be greater than End date"});
            return;
        }

        submissionEvent.save(function(err) {
            if (err) {
                return next(err);
            } else {
                res.json({"success":submissionEvent});
            }
        });
    }else{
        res.json({"error":"User is not authorized to change the Event"});
    }
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
    if(req.user && user.isChair(req)) {
        if (req.body._id) delete req.body._id;
        if (req.createdBy) req.createdBy = req.user._id;
        SubmissionEvent.findByIdAndUpdate(req.submissionEvent.id, req.body, function (err, submissionEvent) {
            if (err) {
                return next(err);
            } else {
                res.json(submissionEvent);
            }
        });
    }else{
        res.json({"error":"User is not authorized to change the Event"});
    }
};

exports.delete = function(req, res, next) {
    if(req.user && user.isChair(req)) {
    req.submissionEvent.remove(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.submissionEvent);
        }
    })
    }else{
        res.json({"error":"User is not authorized to change the Event"});
    }
};
