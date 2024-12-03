"use server";

import { db } from "@/lib/db";
import { getVerificationTokenByToken } from "@/data/verificationToken";
import { NewVerificationResponses } from "@/types";

export async function newVerification(token: string) {
    try {
        const existingToken = await getVerificationTokenByToken(token);

        if (!existingToken) {
            return NewVerificationResponses.INVALID_TOKEN;
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            await db.emailVerificationToken.delete({
                where: { id: existingToken.id },
            });
            return NewVerificationResponses.TOKEN_EXPIRED;
        }

        // Check if the email belongs to a user
        const existingUser = await db.user.findUnique({
            where: { email: existingToken.email },
            select: { id: true, emailVerified: true },
        });

        const existingSubscriber = await db.newsletterSubscriber.findUnique({
            where: { email: existingToken.email },
            select: { id: true, isVerified: true, userId: true },
        });

        if (!existingUser && !existingSubscriber) return NewVerificationResponses.EMAIL_DOES_NOT_EXIST;


        await db.$transaction(async (tx) => {
            if (existingUser) {
                // Update user email verification status
                await tx.user.update({
                    where: { id: existingUser.id },
                    data: {
                        emailVerified: new Date(),
                    },
                });

                // Handle NewsletterSubscriber for the user
                if (!existingSubscriber) {
                    // Create a new subscriber if none exists
                    await tx.newsletterSubscriber.create({
                        data: {
                            email: existingToken.email,
                            userId: existingUser.id,
                            isVerified: true,
                        },
                    });
                } else if (!existingSubscriber.isVerified) {
                    // Verify the existing subscriber
                    await tx.newsletterSubscriber.update({
                        where: { id: existingSubscriber.id },
                        data: { isVerified: true },
                    });
                }
            } else if (existingSubscriber) {
                // Verify subscriber if no user exists
                if (!existingSubscriber.isVerified) {
                    await tx.newsletterSubscriber.update({
                        where: { id: existingSubscriber.id },
                        data: { isVerified: true },
                    });
                }
            }

            // Remove the used verification token
            await tx.emailVerificationToken.delete({
                where: { id: existingToken.id },
            });
        });

        return NewVerificationResponses.EMAIL_VERIFIED;
    } catch (error) {
        console.error("Error verifying email token:", error);
        throw new Error("An error occurred during verification.");
    }
}
