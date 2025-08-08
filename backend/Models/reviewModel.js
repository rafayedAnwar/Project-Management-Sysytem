const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    projectId: { 
        type: mongoose.Schema.Types.Mixed, 
        ref: 'Project',
        validate: {
            validator: function(v) {
                return v === 'general' || mongoose.Types.ObjectId.isValid(v);
            },
            message: props => `${props.value} is not a valid project ID or 'general'`
        },
        required: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    reviewType: {
        type: String,
        enum: ['staff', 'manager'],
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);