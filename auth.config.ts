import Google from "next-auth/providers/google"
import Nodemailer from "next-auth/providers/nodemailer"
import type { NextAuthConfig } from "next-auth"

// Notice this is only an object, not a full Auth.js instance
export default {
    providers: [
        Google,
        Nodemailer({
            server: {
                service: "Gmail",
                auth: {
                    user: process.env.USER,
                    pass: process.env.APP_PASSWORD, // Using APP_PASSWORD as requested
                },
                tls: {
                    rejectUnauthorized: false
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account && profile) {
                // Split full name into first and last name
                const [firstName, ...lastNameParts] = profile.name?.split(" ") || [];
                token.firstName = firstName || null;
                token.lastName = lastNameParts.join(" ") || null;
            }
            return token;
        },
        async session({ session, token }) {
            // Attach first and last names to the session object
            session.user.firstName = token.firstName;
            session.user.lastName = token.lastName;
            return session;
        },
        async signIn({ user, profile }) {
            if (profile.name) {
                const [firstName, ...lastNameParts] = profile.name.split(" ");
                user.firstName = firstName || null;
                user.lastName = lastNameParts.join(" ") || null;
                delete user.name; // Remove the 'name' property
                delete user.id; // Remove the 'name' property
            }
            return true;
        }
    },
} satisfies NextAuthConfig