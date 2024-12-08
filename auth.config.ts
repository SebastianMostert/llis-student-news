import Google from "next-auth/providers/google"
import Nodemailer from "next-auth/providers/nodemailer"
import type { DefaultSession, NextAuthConfig } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's postal address. */
            firstName?: string;
            lastName?: string;
        } & DefaultSession["user"]
    }

    interface User {
        firstName?: string;
        lastName?: string;
    }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        firstName?: string;
        lastName?: string;
    }
}

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
                token.firstName = firstName || undefined;
                token.lastName = lastNameParts.join(" ") || undefined;
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
            if (profile && profile.name) {
                const firstName = profile.name.split(" ")[0];
                const lastNameParts = profile.name.split(" ").slice(1);
                user.firstName = firstName || undefined;
                user.lastName = lastNameParts.join(" ") || undefined;
                delete user.name; // Remove the 'name' property
                delete user.id; // Remove the 'id' property
            }
            return true;
        }
    },
    session: {
        strategy: "jwt", // Use "jwt" or "database" as per your configuration
        maxAge: 30 * 60, // Session will expire after 30 minutes of inactivity
        updateAge: 5 * 60, // Update session age only if the user is active within 5 minutes
    }
} satisfies NextAuthConfig