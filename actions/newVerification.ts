"use server";

import { db } from "@/lib/db";
import { getVerificationTokenByToken } from "@/data/verificationToken";
import { NewVerificationResponses } from "@/types";

export async function newVerification(token: string) {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return NewVerificationResponses.INVALID_TOKEN;
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return NewVerificationResponses.TOKEN_EXPIRED;
    }

    const existingUser = await db.user.findUnique({
        where: {
            email: existingToken.email
        },
        select: {
            id: true
        }
    });

    if (!existingUser) return NewVerificationResponses.EMAIL_DOES_NOT_EXIST;


    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    })

    await db.emailVerificationToken.delete({
        where: {
            id: existingToken.id
        }
    });

    return NewVerificationResponses.EMAIL_VERIFIED
}