const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String },
    skills: [{ type: String }],
    avatarUrl: { type: String },
    githubUrl: { type: String },
    linkedinUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
