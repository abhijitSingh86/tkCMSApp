var ReviewersDocument = require("mongoose").model("ReviewersDocument");

/* This will go and fetch the submissions done/ pending for the reviewer
*
* Select * from submissions where submissionid = 'coming from ui'
* */
exports.list = function(req, res, next) {

        ReviewersDocument.find({_id : req.reviewerId}).populate('submissionDocId').exec(function(err, subevnts) {
            if (err) {
                return next(err);
            } else {
                res.json(subevnts);
            }
        });
};


exports.listAll = function(req, res) {
    ReviewersDocument.find().populate('submissionDocId').exec(function(err, result) {
        if (err) {
            res.status(400).json({"error":"Error processing the list all review call"})
        } else {
            res.json(result);
        }
    });
};


/*This will either create / update the review done by the reviewer for a individual submission
*  Update/insert command based on the submission id.
*
* */
exports.put = function(req, res, next) {
    ReviewersDocument.Place.findOneAndUpdate(req.reviewerDocument.id, req.body,{upsert: true}, function(err, reviewerDocument){
        if (err) {

            var ReviewersDocument1 = new ReviewersDocument(req.body);
            ReviewersDocument1.save(function(err) {
                if (err) {
                    console.log(err)
                    return next(err);
                } else {
                    res.json(ReviewersDocument1);
                }

            });
        }
        else {
            res.json(subevnts);
        }
    });
};

/* This will show all the submissions for a reviwer
 *   Select * from submissions where reviewer in (ui id)
  *
  * */
exports.getReviewDetailForDocument = function(req, res, next) {
    ReviewersDocument.find({submissionDocId: req.params.subDocumentId}).populate('createdBy','firstname')
        .populate('authors','firstname').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
        }
    });
};

exports.reviewersDocumentByID = function(req, res, next, id) {
    ReviewersDocument.findOne({
        _id: id
    }).populate('createdBy').populate('authors').exec(function(err, reviewerDocument) {
        if (err) {
            return next(err);
        } else {
            req.reviewerDocument = reviewerDocument;
            next();
        }
    });
};



exports.create = function(req, res, next) {
    var reviewerDocument = new ReviewersDocument(req.body);
    reviewerDocument.save(function(err) {
        if (err) {
            console.log(err)
            return next(err);
        } else {
            res.json(reviewerDocument);
        }
    });
};
exports.listOfReviewsForUser = function getReviewUserSpecific(req, res){
    if (true){//req.user) {
        var id = req.user.id;
        ReviewersDocument.find({
            createdBy : id
        }).exec(function(err, result) {
            if (err) {
                return res.status(400).json({"error":"Error occurred while query execution to retrieve reviews"});
            } else {
                res.json(result);
            }
        });
    } else {
        res.status(403).json({"error" : "Invalid request"});
    }
}


exports.getReviewForASubDocument = function getReviewDocumentSpecific(req, res,next){
    if (true){//req.user) {
        var id = req.user.id;
        var docId = req.body.submissionDocId;

        ReviewersDocument.findOne({
            createdBy : id , submissionDocId:docId
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
