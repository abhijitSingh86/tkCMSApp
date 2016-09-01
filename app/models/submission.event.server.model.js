var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var SubmissionEventSchema = new Schema({
    name: {
        type : String,
        trim: true
    },
    description: {
        type : String,
        trim: true,
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date,
        required:true
    },
    createdBy : {
        type: Schema.ObjectId,
        ref: 'User'
    }
    ,interestedUsers:[{
        type:Schema.ObjectId,
        ref:'User'
    }]
});
mongoose.model('SubmissionEvent', SubmissionEventSchema);