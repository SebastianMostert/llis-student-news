import { db } from "@/lib/db";

export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await db.emailVerificationToken.findUnique({
            where: { token }
        })

        return verificationToken;
    } catch {
        return null;
    }
}

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.emailVerificationToken.findFirst({
            where: { email }
        })

        return verificationToken;
    } catch {
        return null;
    }
}