const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: String }],
    score: { type: Number, min: 0, max: 100 },
    issues: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
