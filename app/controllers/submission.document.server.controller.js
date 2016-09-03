var SubmissionDocument = require("mongoose").model("SubmissionDocument");
var mongoose = require("mongoose");


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

exports.list = function(req, res, next) {
    SubmissionDocument.find().populate('createdBy').populate('authors').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
        }
    });
};

exports.get = function(req, res, next) {
    SubmissionDocument.find().populate('createdBy').populate('authors').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
        }
    });
};


exports.read = function(req, res) {
    res.json(req.submissionDocument);
};
exports.submissionDocumentByID = function(req, res, next, id) {
    SubmissionDocument.findOne({
        _id: id
    }).populate('createdBy').populate('authors').populate('submissionEventId').exec(function(err, submissionDocument) {
        if (err) {
            return next(err);
        } else {
            req.submissionDocument = submissionDocument;
            next();
        }
    });
};

exports.update = function(req, res, next) {
    SubmissionDocument.findByIdAndUpdate(req.submissionDocument.id, req.body, function(err, submissionDocument) {
        if (err) {
            return next(err);
        } else {
            res.json(submissionDocument);
        }
    });
};

exports.delete = function(req, res, next) {
    req.submissionDocument.remove(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.submissionDocument);
        }
    })
};

exports.listOfSubmissionDocumentForUserAndEvent = function  listOfSubmissionDocumentForUserAndEvent(req,res,next){
    if (true){//req.user) {
        var userId = req.body.userId;
        var eventId = req.body.submissionEventId;

        SubmissionDocument.findOne({
            createdBy : userId , submissionEventId:eventId
        }).exec(function(err, result) {
            if (err) {
                return res.status(400).json({"error":"Error occurred while query execution"});
            } else {
                if(result == null){
                    res.json({"status":"notsubmitted"});
                }else{
                    res.json(result);
                }
            }
        });
    } else {
        res.status(403).json({"error" : "Invalid request"});
    }
}

exports.listOfSubmissionDocumentForUser= function  listOfSubmissionDocumentForUser(req,res){
    if (true){//req.user) {
        var userId = req.body.userId;

        SubmissionDocument.findOne({
            createdBy : userId
        }).exec(function(err, result) {
            if (err) {
                return res.status(400).json({"error":"Error occurred while query execution"});
            } else {
                    res.json(result);
            }
        });
    } else {
        res.status(403).json({"error" : "Invalid request"});
    }
}


exports.listOfAllSubmissionsForEvent = function(req,res){
  if(true) {//
      var eventId = req.params.eventId;

      SubmissionDocument.find({
          submissionEventId: mongoose.Types.ObjectId(eventId)
      },function(err,result){
          if(err){
              res.status(400).json({"error":"error retrieving the document for event id"});
          }else{
              res.json(result);
          }
      });
  }
};