// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                await dbConnect();
                const user = await User.findOne({ email: credentials.email });
                if (user && bcrypt.compareSync(credentials.password, user.password)) {
                    return user;
                } else {
                    throw new Error('Invalid email or password');
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            await dbConnect();
            if (account.provider === 'google') {
                let existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    existingUser = new User({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: 'member',
                        provider: account.provider,
                        googleId: user.id,
                    });
                    await existingUser.save();
                }
                user.role = existingUser.role;
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/sign-in',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
