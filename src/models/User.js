import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    name: String,
    image: String,
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
    provider: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    password: { type: String },
});

export default mongoose.models.User || mongoose.model('User', userSchema);