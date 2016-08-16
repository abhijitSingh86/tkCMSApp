var ReviewersDocument = require("mongoose").model("ReviewersDocument");



exports.create = function(req, res, next) {
    var reviewersEvent = new ReviewersDocument(req.body);
    reviewersEvent.save(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(reviewersEvent);
        }
    });
};

exports.list = function(req, res, next) {
    ReviewersDocument.find().populate('createdBy').populate('authors').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
        }
    });
};

exports.get = function(req, res, next) {
    ReviewersDocument.find().populate('createdBy').populate('authors').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
        }
    });
};


exports.read = function(req, res) {
    res.json(req.ReviewersDocument);
};
exports.ReviewersDocumentByID = function(req, res, next, id) {
    ReviewersDocument.findOne().populate('createdBy').populate('authors').exec(function(err, ReviewersDocument) {
        if (err) {
            return next(err);
        } else {
            req.ReviewersDocument = ReviewersDocument;
            next();
        }
    });
};

exports.update = function(req, res, next) {
    ReviewersDocument.findByIdAndUpdate(req.ReviewersDocument.id, req.body, function(err, ReviewersDocument) {
        if (err) {
            return next(err);
        } else {
            res.json(ReviewersDocument);
        }
    });
};

exports.delete = function(req, res, next) {
    req.ReviewersDocument.remove(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.ReviewersDocument);
        }
    })
};
