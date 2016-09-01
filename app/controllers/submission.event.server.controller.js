var SubmissionEvent = require("mongoose").model("SubmissionEvent");
var user = require("../controllers/users.server.controller.js");


exports.create = function(req, res, next) {
    if(req.user && user.isChair(req)) {
        var submissionEvent = new SubmissionEvent(req.body);
        submissionEvent.createdBy = req.user._id;

        if(new Date(req.body.start_date) > new Date(req.body.end_date)) {
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
    SubmissionEvent.find().populate('createdBy','firstName').populate('interestedUsers','firstName').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
        }
    });
};

exports.get = function(req, res, next) {
    SubmissionEvent.find().populate('createdBy','firstName').populate('interestedUsers','firstName').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
        }
    });
};


exports.read = function(req, res) {
    SubmissionEvent.findOne({
        _id: req.submissionEvent.id
    }).populate('createdBy','firstName').populate('interestedUsers','firstName').exec(function(err, submissionEvent) {
        if (err) {
            return next(err);
        } else {
            res.json(submissionEvent);
        }
    });

};
exports.submissionEventByID = function(req, res, next, id) {
    SubmissionEvent.findOne({
        _id: id
    }).populate('createdBy','firstName').exec(function(err, submissionEvent) {
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

        if(new Date(req.body.start_date) > new Date(req.body.end_date)) {
            res.json({"error": "Start date can't be greater than End date"});
            return;
        }

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

exports.addToInterestedUserList = function(req,res,next){
    if(true){//req.user && user.isChair(req)) {
        var userList = req.body.interestedUsers;
        for (var i = 0; i < userList.length; i++) {
            if(req.submissionEvent.interestedUsers.indexOf(userList[i]) ==-1){
                req.submissionEvent.interestedUsers.push(userList[i]);
            }
        }
            if(userList && userList.length >0) {
            var id=req.submissionEvent.id;
            SubmissionEvent.findByIdAndUpdate(id,
               // {$set : {name:"newName11"}},
                {  $set: { interestedUsers: req.submissionEvent.interestedUsers}},
                {new:true,safe: true, upsert: true},
                function (err, submissionEvent) {
                    if (err) {
                        return next(err);
                    } else {
                        res.json(submissionEvent);
                    }
                });
        }else{
            res.status(400).json({"error":"Interested user list can't be empty"})
        }
    }else{
        res.status(401).json({"error":"User is not authorized to change the Event"});
    }
};

exports.deleteFromInterestedUserList = function(req,res,next){
    if(true){//req.user && user.isChair(req)) {
        var userList = req.body.interestedUsers;
        for (var i = 0; i < userList.length; i++) {
            if(req.submissionEvent.interestedUsers.indexOf(userList[i]) >-1){
                req.submissionEvent.interestedUsers.splice(i,1);
            }
        }
        if(userList && userList.length >0) {
            var id=req.submissionEvent.id;
            SubmissionEvent.findByIdAndUpdate(id,
                // {$set : {name:"newName11"}},
                {  $set: { interestedUsers: req.submissionEvent.interestedUsers}},
                {new:true,safe: true, upsert: true},
                function (err, submissionEvent) {
                    if (err) {
                        return next(err);
                    } else {
                        res.json(submissionEvent);
                    }
                });
        }else{
            res.status(400).json({"error":"Interested user list can't be empty"})
        }
    }else{
        res.status(401).json({"error":"User is not authorized to change the Event"});
    }
};

exports.retrieveUsersBelongingToEvent = function(req,res,next){
    if(true) {//req.user && user.isChair(req)) {

    }
};


exports.retrieveReviewersForEvent = function(req,res,next){
    if(true) {//req.user && user.isChair(req)) {
                // req.submissionEvent.
        SubmissionEvent.findOne({
            _id: req.submissionEvent.id
        }).populate('interestedUsersAsReviewer','firstName').exec(function(err, submissionEvent) {
            if (err) {
                return next(err);
            } else {
                res.json(submissionEvent.interestedUsersAsReviewer);
            }
        });
    }
};

exports.retrieveAuthorsToEvent = function(req,res,next){
    if(true) {//req.user && user.isChair(req)) {
        // req.submissionEvent.
        SubmissionEvent.findOne({
            _id: req.submissionEvent.id
        }).populate('interestedUsers','firstName').exec(function(err, submissionEvent) {
            if (err) {
                return next(err);
            } else {
                res.json(submissionEvent.interestedUsers);
            }
        });
    }
};

