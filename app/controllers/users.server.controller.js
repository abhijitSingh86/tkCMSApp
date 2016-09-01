var User = require("mongoose").model("User"),
passport = require('passport');
var SubmissionEvent = require("mongoose").model("SubmissionEvent");
var SubmissionDocument = require("mongoose").model("SubmissionDocument");
    var mongoose = require('mongoose');

exports.list = function(req, res, next) {
    User.find({}, function(err, users) {
        if (err) {
            return next(err);
        } else {
            res.json(users);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.user);
};
exports.userByID = function(req, res, next, id) {
    User.findOne({
        _id: id
    }, function(err, user) {
        if (err) {
            return next(err);
        } else {
            if(user._id) delete user._id;
            req.user = user;
            next();
        }
    });
};

exports.update = function(req, res, next) {
    User.findByIdAndUpdate(req.user.id, req.body,{new: true}, function(err, user) {
        if (err) {
            return next(err);
        } else {
            res.json(user);
        }
    });
};

exports.delete = function(req, res, next) {
    req.user.remove(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.user);
        }
    })
};

var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].
                message;
        }
    }
    return message;
};
exports.renderSignin = function(req, res, next) {
    if (!req.user) {
        res.render('signin', {
            title: 'Sign-in Form',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.json({"action":"success"});
    }
};
exports.renderSignup = function(req, res, next) {
    if (!req.user) {
        res.render('signup', {
            title: 'Sign-up Form',
            messages: req.flash('error')
        });
    } else {
        return res.json({"action":"success"});
    }
};

exports.signup = function(req, res, next) {
    if (!req.user) {
        var user = new User(req.body);
        var message = null;
        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                res.json('error', message);
                return res;
            }
            req.login(user, function(err) {
                if (err) return next(err);
                return res.json({"action":"success"});
            });
        });
    } else {
        return res.json({"action":"success"});
    }
};
exports.create = function(req, res, next) {
    if (!req.user) {
        var user = new User(req.body);
        var message = null;
        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                res.json({"user" : "invalid","error" : message});
            }
            req.login(user, function(err) {
                if (err) return next(err);
                res.json({"user" : "valid"});
            });
        });
    } else {
        res.json({"user" : "valid"});
    }
};

exports.intevents = function(req, res, next) {
    SubmissionEvent.find({interestedUsers : req.userId}).populate('name').populate('description').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
        }
    });

};

exports.subevents = function(req, res, next) {
    SubmissionEvent.find({SubscribedUsers : req.userId}).populate('name').populate('description').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
        }
    });

};

exports.subdocs = function(req, res, next) {
    SubmissionDocument.find( { $or: [{SubscribedUsers : req.userId}, {authors: req.userId}] }).populate('name').populate('description').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
        }
    });

};

exports.getall = function(req, res, next) {
    User.find({},'-salt -password').exec(function(err, users) {
        if (err) {
            return next(err);
        } else {
            res.json(users);
        }
    });

};

exports.signout = function(req, res) {
    req.logout();
    res.json({"action":"success"});
};

exports.isChair=function(req){
    if(req.user.roles.indexOf("chair") >-1) return true; else return false;
}

exports.loggedIn = function loggedIn(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
}



exports.getAssignedSubmissions = function getAllAssignedEvents(req, res){
    if (true){//req.user) {
        var id = req.user.id;
        User.findOne({
            _id: id
        }).populate('assignedSubmissionEvents').exec(function(err, user) {
            if (err) {
                return res.status(400).json({"error":"Error occurred while query execution"});
            } else {
                res.json(
                    user.assignedSubmissionEvents
                );
            }
        });
    } else {
        res.status(403).json({"error" : "Invalid request"});
    }
};


// exports.getReviewForASubDocument = function getReviewDocumentSpecific(req, res,next){
//     if (true){//req.user) {
//         var id = req.user.id;
//         User.findOne({
//             _id: id
//         }).populate("assignedSubmissionForReview").exec(function(err, user) {
//             if (err) {
//                 return res.status(400).json({"error":"Error occurred while query execution"});
//             } else {
//                 var jsonData = user.assignedSubmissionForReview;
//                 var docId = req.body.submissionDocId;
//                 if(jsonData!=null && jsonData.length >0){
//                     for(var i=0;i<jsonData.length;i++){
//                         if(jsonData[i].id == docId ){
//                             res.json(jsonData[i]);
//                            next();
//                         }
//                     }
//                     next();
//                 }
//             }
//         });
//     } else {
//         res.status(403).json({"error" : "Invalid request"});
//     }
//
// }

exports.getAssignedReviews = function getAllReviewUserSpecific(req, res){
    if (true){//req.user) {
        var id = req.user.id;
        User.findOne({
            _id: id
        }).populate("assignedSubmissionForReview").exec(function(err, user) {
            if (err) {
                return res.status(400).json({"error":"Error occurred while query execution"});
            } else {
                res.json(
                    user.assignedSubmissionForReview
                );
            }
        });
    } else {
        res.status(403).json({"error" : "Invalid request"});
    }
};

exports.getAllReviews = function getAllReviewUserSpecific(req,res){
    if (true){//req.user) {
        var id = req.user.id;
        User.findOne({
            _id: id
        }).populate("assignedSubmissionForReview").exec(function(err, user) {
            if (err) {
                return res.status(400).json({"error":"Error occurred while query execution"});
            } else {
                res.json(
                    user.assignedSubmissionForReview
                );
            }
        });
    } else {
        res.status(403).json({"error" : "Invalid request"});
    }
};


exports.subscribeUserToEvent = function(req,res,next){
    if(true){//req.user && user.isChair(req)) {

        var userList = req.body.users;
        var submissionEventId = req.body.submissionEventId;
        if(userList && userList.length >0) {
            for(var i=0;i<userList.length;i++) {
                User.update({_id: mongoose.Types.ObjectId(userList[i])}, {$addToSet: {assignedSubmissionEvents: mongoose.Types.ObjectId(submissionEventId)}},
                    {new: true, safe: true},
                    function (err, output) {
                        if (err) {
                            return next(err);
                        } else {
                            res.json({"success": output});
                        }
                    });
            }
        }else{
            res.status(400).json({"error":"Interested user list can't be empty"})
        }
    }else{
        res.status(401).json({"error":"User is not authorized to change the Event"});
    }
};

exports.subscribeReviewerToDocument = function(req, res, next){
    if(true){//req.user && user.isChair(req)) {

        var userList = req.body.users;
        var submissionDocumentId = req.body.submissionDocumentId;
        if(userList && userList.length >0) {
            for(var i=0;i<userList.length;i++) {
                User.update({_id: mongoose.Types.ObjectId(userList[i])}, {$addToSet: {assignedSubmissionForReview: mongoose.Types.ObjectId(submissionDocumentId)}},
                    {new: true, safe: true},
                    function (err, output) {
                        if (err) {
                            return next(err);
                        } else {
                            res.json({"success": output});
                        }
                    });
            }
        }else{
            res.status(400).json({"error":"Interested user list can't be empty"})
        }
    }else{
        res.status(401).json({"error":"User is not authorized to change the Event"});
    }
};


