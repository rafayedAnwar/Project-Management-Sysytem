const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: true
    },
    titles: {
        type: [String],
        enum: [
            'UI/UX',
            'Frontend',
            'Backend',
            'Fullstack',
            'Database',
            'DevOps',
            'Project ',
            'QA Engineer',
            'Business Analyst',
            'Project Manager'
        ],
        required: true
    },
    assignedTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    project_assigned: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Project',
        default: []
    },
    googleMeetId: {
        type: String,
        default: null
    },
    reviewsGiven: [{
        projectId: { 
            type: mongoose.Schema.Types.Mixed, 
            ref: 'Project',
            validate: {
                validator: function(v) {
                    return v === 'general' || mongoose.Types.ObjectId.isValid(v);
                },
                message: props => `${props.value} is not a valid project ID or 'general'`
            }
        },
        toStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: Number,
        comment: String
    }],
    reviewsReceived: [{
        projectId: { 
            type: mongoose.Schema.Types.Mixed, 
            ref: 'Project',
            validate: {
                validator: function(v) {
                    return v === 'general' || mongoose.Types.ObjectId.isValid(v);
                },
                message: props => `${props.value} is not a valid project ID or 'general'`
            }
        },
        fromStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: Number,
        comment: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
