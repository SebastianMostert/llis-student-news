import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import type { DefaultSession, NextAuthConfig } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            /** The user's postal address. */
            firstName?: string;
            lastName?: string;
            roles?: RolesWithPermissions[];
        } & DefaultSession["user"];
    }

    interface User {
        firstName?: string;
        lastName?: string;
        roles?: RolesWithPermissions[];
    }
}

import { JWT } from "next-auth/jwt";
import { Role } from "@prisma/client";
import { RolesWithPermissions } from "./types";

declare module "next-auth/jwt" {
    interface JWT {
        firstName?: string;
        lastName?: string;
        roles?: RolesWithPermissions[];
    }
}

export default {
    providers: [
        Google,
        Nodemailer({
            server: {
                service: "Gmail",
                auth: {
                    user: process.env.USER,
                    pass: process.env.APP_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account && profile) {
                const [firstName, ...lastNameParts] = profile.name?.split(" ") || [];
                token.firstName = firstName || undefined;
                token.lastName = lastNameParts.join(" ") || undefined;
            }

            // Fetch roles from the database
            if (token.email) {
                const user = await db.user.findUnique({
                    where: { email: token.email },
                    select: { roles: { include: { permissions: true } } },
                });
                token.roles = user?.roles || [];
            }

            return token;
        },
        async session({ session, token }) {
            // Attach first and last names, and roles to the session object
            session.user.firstName = token.firstName;
            session.user.lastName = token.lastName;
            session.user.roles = token.roles;
            return session;
        },
        async signIn({ user, profile }) {
            if (profile && profile.name) {
                const firstName = profile.name.split(" ")[0];
                const lastNameParts = profile.name.split(" ").slice(1);
                user.firstName = firstName || undefined;
                user.lastName = lastNameParts.join(" ") || undefined;
                delete user.name;
                delete user.id;
            }
            return true;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 60,
        updateAge: 5 * 60,
    },
} satisfies NextAuthConfig;
