"use server";

import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SendCodeResponses } from "@/types";
import { db } from "@/lib/db";

export async function sendVerificationCode({ email }: { email: string }): Promise<SendCodeResponses> {
    try {
        // Fetch user and subscriber details in one query
        const userAndSubscriber = await db.user.findUnique({
            where: { email },
            select: {
                id: true,
                emailVerified: true,
                firstName: true,
                lastName: true,
                NewsletterSubscriber: {
                    select: {
                        id: true,
                        isVerified: true,
                        email: true,
                    },
                },
            },
        });

        const existingSubscriber = await db.newsletterSubscriber.findUnique({
            where: { email },
        });

        // Case 1: Existing user and subscriber
        if (userAndSubscriber) {
            const { emailVerified, NewsletterSubscriber } = userAndSubscriber;
            const currentSubscriber = NewsletterSubscriber.find((subscriber) => subscriber.email === email);

            // Link newsletter subscription if missing
            if (!currentSubscriber && !existingSubscriber) {
                await db.newsletterSubscriber.create({
                    data: {
                        email,
                        userId: userAndSubscriber.id,
                        isVerified: !!emailVerified,
                    },
                });
            }

            if (emailVerified || currentSubscriber?.isVerified || existingSubscriber?.isVerified) {
                return SendCodeResponses.EMAIL_ALREADY_VERIFIED;
            }

            // Send verification email
            await sendVerification({ email });
            return SendCodeResponses.CODE_SENT;
        }

        // Case 2: New subscriber (no user record)
        if (!existingSubscriber) {
            await db.newsletterSubscriber.create({
                data: {
                    email,
                    isVerified: false,
                },
            });

            // Send verification email
            await sendVerification({ email });
            return SendCodeResponses.CODE_SENT;
        }

        // Case 3: Existing unverified subscriber
        if (!existingSubscriber.isVerified) {
            await sendVerification({ email });
            return SendCodeResponses.CODE_SENT;
        }

        // Fallback: Already verified subscriber
        return SendCodeResponses.EMAIL_ALREADY_VERIFIED;
    } catch (error) {
        console.error("Error in sendVerificationCode:", error);
        throw new Error("Failed to send verification code.");
    }
}

async function sendVerification({ email }: { email: string }) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
}