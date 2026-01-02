const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    language: { type: String, required: true },
    code: { type: String, required: true }, 
    status: { type: String, enum: ['PENDING', 'ANALYZED', 'COMPLETED', 'REJECTED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
