var SubmissionEvent = require("mongoose").model("SubmissionEvent");
var user = require("../controllers/users.server.controller.js");


exports.create = function(req, res, next) {
    if(req.user && user.isChair(req)) {
        var submissionEvent = new SubmissionEvent(req.body);
        submissionEvent.createdBy = req.user._id;

        if(new Date(req.body.start_date) > new Date(req.body.end_date)) {
            res.status(400).json({"error": "Start date can't be greater than End date"});
            return;
        }

        submissionEvent.save(function(err) {
            if (err) {
                return res.status(400).json({"error":"Error while creating the Event"});
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
            return res.status(400).json({"error":"Error while listing the Events"});
        } else {
            res.json(subevnts);
        }
    });
};

exports.get = function(req, res, next) {
    SubmissionEvent.find().populate('createdBy','firstName').populate('interestedUsers','firstName').exec(function(err, subevnts) {
        if (err) {
            return res.status(400).json({"error":"Error while getting the Event"});
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
            return res.status(400).json({"error":"Error while getting the Event"});
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
            return res.status(400).json({"error":"Error while getting the Event"});
        } else {
            req.submissionEvent = submissionEvent;
            next();
        }
    });
};

exports.update = function(req, res, next) {
    if(req.user && user.isChair(req)) {

        if(new Date(req.body.start_date) > new Date(req.body.end_date)) {
            res.status(400).json({"error": "Start date can't be greater than End date"});
            return;
        }

        if (req.body._id) delete req.body._id;
        if (req.body.interestedUsers) delete req.body.interestedUsers;
        if (req.body.interestedUsersAsReviewer) delete req.body.interestedUsersAsReviewer;
        if (req.createdBy) req.createdBy = req.user._id;
        SubmissionEvent.findByIdAndUpdate(req.submissionEvent.id, req.body, function (err, submissionEvent) {
            if (err) {
                return res.status(400).json({"error":"Error while updating the Event"});
            } else {
                res.json(submissionEvent);
            }
        });
    }else{
        res.status(400).json({"error":"User is not authorized to change the Event"});
    }
};

exports.delete = function(req, res, next) {
    if(req.user && user.isChair(req)) {
        req.submissionEvent.remove(function(err) {
            if (err) {
                return res.status(400).json({"error":"Error while deleting the Event"});
            } else {
                res.json(req.submissionEvent);
            }
        })
    }else{
        res.status(400).json({"error":"User is not authorized to change the Event"});
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
                        return res.status(400).json({"error":"Error while adding users into the Event"});
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
                        return res.status(400).json({"error":"Error while deleting interested user for the Event"});
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


exports.retrieveInterestedReviewersForEvent = function(req, res, next){
    if(true) {//req.user && user.isChair(req)) {
                // req.submissionEvent.
        SubmissionEvent.findOne({
            _id: req.submissionEvent.id
        }).populate('interestedUsersAsReviewer','firstName').populate('interestedUsers','firstName').exec(function(err, submissionEvent) {
            if (err) {
                return res.status(400).json({"error":"Error while retrieving interested reviewers the Event"});
            } else {
                res.json(submissionEvent.interestedUsersAsReviewer,submissionEvent.interestedUsers);
            }
        });
    }
};

exports.retrieveApprovedAuthorsToEvent = function(req,res,next){
    if(true) {//req.user && user.isChair(req)) {
        var submissionEventId = req.submissionEvent.id;
        SubmissionEvent.findOne({
            _id: submissionEventId
        }).populate('interestedUsers').exec(function(err, submissionEvent) {
            if (err) {
                return res.status(400).json({"error":"Error while retrieving approved authors for the Event"});
            } else {
                var acceptedArr = [];
                var rejectedArr = [];
                if(submissionEvent==null || submissionEvent.length ==0){
                    res.status(405).json({"error":"Invalid Event id"});
                }else if(submissionEvent.interestedUsers.length ==null || submissionEvent.interestedUsers ==0) {
                    res.status(405).json({"error":"Empty interested user list"})
                }else
                {
                    for(var i=0;i<submissionEvent.interestedUsers.length;i++) {
                        var assignedEvents = submissionEvent.interestedUsers[i].assignedSubmissionEvents;
                        if (assignedEvents.indexOf(submissionEventId) != -1) {
                            acceptedArr.push(submissionEvent.interestedUsers[i].id);
                        } else {
                            rejectedArr.push(submissionEvent.interestedUsers[i].id);
                        }
                    }
                    res.json({"acceptedUser":acceptedArr,"notAcceptedUser":rejectedArr});

                }
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
                return res.status(400).json({"error":"Error while retrieving interested authors of the Event"});
            } else {
                res.json(submissionEvent.interestedUsers);
            }
        });
    }
};

