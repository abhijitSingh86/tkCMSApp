var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ReviewersDocumentSchema = new Schema({
    createdOn: {
        type: Date,
        default: Date.now
    },
    createdBy : {
    type: Schema.ObjectId,
    ref: 'User'
    },
    comments: {
        type: String,
        trim: true

    },
    submissionDocId:{
        type : Schema.ObjectId,
        ref: "SubmissionDocument"
    },
    status : {
        type:String,
        default : "InProgress"
    }

});
mongoose.model('ReviewersDocument', ReviewersDocumentSchema);