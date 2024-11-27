"use server";

import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SendCodeResponses } from "@/types";
import { db } from "@/lib/db";

export async function sendVerificationCode({ email, firstName, lastName }: { email: string, firstName: string, lastName: string }) {
    // Check if user exists
    const existingUser_ = await db.user.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            emailVerified: true,
            email: true,
            firstName: true,
            lastName: true,
            subscribedToNewsletter: true
        }
    })

    if (!existingUser_) {
        const newUser = await db.user.create({
            data: {
                email,
                subscribedToNewsletter: false,
                firstName,
                lastName
            }
        })

        const verificationToken = await generateVerificationToken(newUser.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return SendCodeResponses.CODE_SENT;
    }

    if (existingUser_.firstName !== firstName || existingUser_.lastName !== lastName) {
        await db.user.update({
            where: {
                id: existingUser_.id
            },
            data: {
                firstName,
                lastName
            }
        });
    }

    if (existingUser_.emailVerified) return SendCodeResponses.EMAIL_ALREADY_VERIFIED;

    const verificationToken = await generateVerificationToken(existingUser_.email);

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
    );

    return SendCodeResponses.CODE_SENT;
};