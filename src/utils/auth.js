import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/email"
import prisma from "./connect";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials"

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        Nodemailer({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
        // Credentials({
        //     // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        //     // e.g. domain, username, password, 2FA token, etc.
        //     credentials: {
        //         email: {},
        //         password: {},
        //     },
        //     authorize: async (credentials) => {
        //         try {
        //             let user = null

        //             const { email, password } = await signInSchema.parseAsync(credentials)

        //             // logic to salt and hash password
        //             const pwHash = saltAndHashPassword(password)

        //             // logic to verify if the user exists
        //             user = await getUserFromDb(email, pwHash)

        //             if (!user) {
        //                 throw new Error("User not found.")
        //             }

        //             // return JSON object with the user data
        //             return user
        //         } catch (error) {
        //             if (error instanceof ZodError) {
        //                 // Return `null` to indicate that the credentials are invalid
        //                 return null
        //             }
        //         }
        //     },
        // }),
    ],
};

export const getAuthSession = () => getServerSession(authOptions);