'use server';

import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function registerUser(formData) {
    const { name, email, password, provider, googleId } = Object.fromEntries(formData);

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    let hashedPassword = null;
    if (provider !== 'google') {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create a new user
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        provider,
        googleId,
    });

    await newUser.save();

    return { message: 'User registered successfully' };
}
