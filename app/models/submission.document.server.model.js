var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    SubmissionEvent = mongoose.model("SubmissionEvent");
var SubmissionDocumentSchema = new Schema({
    name: {
        type : String,
        trim: true
    },
    keywords: [{
        type : String,
        trim: true
    }],
    abstract: {
        type : String,
        trim: true
    },
    authors: [{
        type : Schema.ObjectId,
        ref: "User"
    }],
    created: {
        type: Date,
        default: new Date()
    },
    createdBy : {
    type: Schema.ObjectId,
    ref: 'User'
    },
    submissionEventId : {
        type: Schema.ObjectId,
        ref: 'SubmissionEvent',
        required  : [ true , "Submission without any event not possible"]

    },
    reviewers:[{
        type : Schema.ObjectId,
        ref: "User"
    }]
});


SubmissionDocumentSchema.pre('validate', function(next) {

    var ct_dt = new Date(this.created);
        SubmissionEvent.findOne({_id : this.submissionEventId}).exec(function(err, subevnts) {
            if (err) {
                console.log("Error retrieving event for Submission document validation check"+err);
                next(Error("eror"));
            } else if(subevnts ==null){next()}
            else{
                // console.log(new Date(ct_dt) >= new Date(subevnts.start_date));

                console.log(ct_dt+"--"+subevnts.start_date+"--"+subevnts.end_date);


                if(ct_dt >= new Date(subevnts.start_date) && ct_dt <= new Date(subevnts.end_date)){
                    //fine its a valid submission
                    console.log(subevnts);
                    next();
                }else{

                    console.log(subevnts);
                    console.log("condition didn't matched for event date");
                    next(Error("creation date should lie between event startDate and endDate"));
                }
                // res.json(subevnts);
            }
        });
    }
)

mongoose.model('SubmissionDocument', SubmissionDocumentSchema);