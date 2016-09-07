var SubmissionDocument = require("mongoose").model("SubmissionDocument");
var mongoose = require("mongoose");
var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs')
var bodyParser = require('body-parser');
var multer = require('multer');;

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        //var datetimestamp = Date.now();
        cb(null, req.headers.submissionid + '.pdf')//file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
var upload = multer({ //multer settings
    storage: storage
}).single('file');

exports.upload = function(req, res,next) {
    
   // console.log("here");
    //console.log(req.headers);
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        res.json({error_code:0,err_desc:null});
    })


}

exports.download = function(req,res) {
    ///console.log("here");
   // console.log(req.params.userId);
    //console.log(req.params.subDocId);
    //var nomefile = req.body.id;
   // var nomefile = req.body.id;
    var file = fs.readFileSync('./uploads/'+req.params.userId+'_'+ req.params.subDocId+'.pdf','binary');
   // console.log(file);
    res.setHeader('Content-Length', file.length);
    res.write(file,'binary');
    res.end();

};
   /* res.status(200);
    var filepath = path.normalize(__dirname + '/../../');
    filepath += 'uploads';
    console.log(filepath);
   // var filename = req.params.userId+'_' +req.params.subDocId +'.pdf';
    var filename='test_test.pdf';
    res.download(filepath,filename);*/
//};


exports.create = function(req, res, next) {

    var submissionDoc = new SubmissionDocument(req.body);
    submissionDoc.save(function(err) {
        if (err) {
            console.log(err)
            return next(err);
        } else {
            res.json(submissionDoc);
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
    }).populate('createdBy').populate('authors').populate('submissionEventId').populate('reviewers').exec(function(err, submissionDocument) {
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

        SubmissionDocument.find({
            createdBy : userId
        }).exec(function(err, result) {
            if (err) {
                return res.status(400).json({"error":"Error occurred while query execution"});
            } else {
                var array = [];
                if(result != null && result.length >0)
                    for(var i=0;i<result.length;i++){
                        array.push(result[i]);
                    }
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

exports.listOfAllReviewsForSubmissionDocument = function(req,res){
    if(true) {//
        SubmissionDocument.find({
            _id: req.submissionDocument._id
        }).populate("").exec(function(err,result){
            if(err){
                res.status(400).json({"error":"error retrieving the document for event id"});
            }else{
                res.json(result);
            }
        });
    }
};