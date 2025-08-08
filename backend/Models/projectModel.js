const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company_title: {
        type: String,
        required: true,
        trim: true
    },
    aproval_stat: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    duration: {
        type: Number,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    team_size: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    projectManager: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
