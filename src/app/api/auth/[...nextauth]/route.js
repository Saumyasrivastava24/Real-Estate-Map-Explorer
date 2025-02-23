// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User"; 

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isValid = bcrypt.compareSync(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        // Return user data as plain object or a simple subset
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Only connect to DB & handle logic if provider is Google
      if (account.provider === "google") {
        await dbConnect();

        // Check if user already exists
        let existingUser = await User.findOne({ email: user.email });

        // If not, create a new user in DB
        if (!existingUser) {
          existingUser = new User({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "member", // or "user"
            provider: account.provider,
            googleId: user.id,
          });
          await existingUser.save();
        }

        // Attach DB info to 'user' object so JWT callback can see it
        user.id = existingUser._id.toString();
        user.role = existingUser.role;
      }
      return true; // If false, sign-in is aborted
    },

    async jwt({ token, user }) {
      // 'user' is defined only at sign-in
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
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  // Optional: If you have a custom sign-in page in the App Router, e.g. /app/auth/sign-in
  pages: {
    signIn: "/auth/sign-in",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
