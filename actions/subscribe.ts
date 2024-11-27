"use server";

import { sendSubscriptionConfirmationEmail, sendVerificationEmail } from "@/lib/mail";
import { db } from "@/lib/db";
import { SendCodeResponses, SubscribeResponses } from "@/types";

export async function subscribe(email: string) {
    // Check if user exists
    const existingUser_ = await db.user.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            emailVerified: true,
            email: true,
            subscribedToNewsletter: true
        }
    })

    if (!existingUser_)  return SubscribeResponses.EMAIL_DOES_NOT_EXIST;
    if (!existingUser_.emailVerified) return SubscribeResponses.EMAIL_NOT_VERIFIED;
    if (existingUser_.subscribedToNewsletter) return SubscribeResponses.ALREADY_SUBSCRIBED;

    await db.user.update({
        where: {
            email: existingUser_.email
        },
        data: {
            subscribedToNewsletter: true
        }
    })

    // TODO: Send welcome email
    sendSubscriptionConfirmationEmail(email, existingUser_.id);
    
    return SubscribeResponses.SUBSCRIBED;
};