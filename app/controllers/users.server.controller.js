var User = require("mongoose").model("User"),
passport = require('passport');
var SubmissionEvent = require("mongoose").model("SubmissionEvent");
var SubmissionDocument = require("mongoose").model("SubmissionDocument");

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
                res.flash('error', message);
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
    User.find().populate('username').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
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
}

