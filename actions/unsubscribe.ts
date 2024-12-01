"use server";

import { sendUnsubscriptionConfirmationEmail } from "@/lib/mail";
import { UnsubscribeResponses } from "@/types";
import { db } from "@/lib/db";

export async function unsubscribe(id: string) {
    // Check if user exists

    const existingUser_ = await db.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            emailVerified: true,
            email: true,
            subscribedToNewsletter: true
        }
    }).catch((error) => {
        throw new Error("Error getting user to unsubscribe");
    })

    if (!existingUser_) return UnsubscribeResponses.EMAIL_DOES_NOT_EXIST;
    if (!existingUser_.subscribedToNewsletter) return UnsubscribeResponses.ALREADY_UNSUBSCRIBED;

    await db.user.update({
        where: {
            email: existingUser_.email
        },
        data: {
            subscribedToNewsletter: false
        }
    }).catch((error) => {
        throw new Error("Error unsubscribing user");
    })
    
    sendUnsubscriptionConfirmationEmail(existingUser_.email);

    return UnsubscribeResponses.UNSUBSCRIBED;
};