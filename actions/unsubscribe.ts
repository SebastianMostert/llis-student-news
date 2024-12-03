"use server";

import { sendUnsubscriptionConfirmationEmail } from "@/lib/mail";
import { UnsubscribeResponses } from "@/types";
import { db } from "@/lib/db";

export async function unsubscribe(id: string) {
    // Check if user exists

    const existingSubscriber = await db.newsletterSubscriber.findUnique({
        where: { id },
        select: {
            email: true,
            id: true,
            isVerified: true,
            subscribedAt: true,
            unsubscribedAt: true,
        }
    }).catch((error) => {
        throw new Error("Error getting user to unsubscribe");
    })

    if (!existingSubscriber) return UnsubscribeResponses.EMAIL_DOES_NOT_EXIST;
    if (!existingSubscriber.subscribedAt) return UnsubscribeResponses.ALREADY_UNSUBSCRIBED;

    await db.newsletterSubscriber.update({
        where: {
            email: existingSubscriber.email
        },
        data: {
            isVerified: true,
            unsubscribedAt: new Date(),
            subscribedAt: null
        }
    }).catch((error) => {
        throw new Error("Error unsubscribing user");
    })

    sendUnsubscriptionConfirmationEmail(existingSubscriber.email, existingSubscriber.id);

    return UnsubscribeResponses.UNSUBSCRIBED;
};

export async function unsubscribeWithEmail(email: string) {
    // Check if user exists

    const existingSubscriber = await db.newsletterSubscriber.findUnique({
        where: { email },
        select: {
            email: true,
            id: true,
            isVerified: true,
            subscribedAt: true,
            unsubscribedAt: true,
        }
    }).catch((error) => {
        throw new Error("Error getting user to unsubscribe");
    })

    if (!existingSubscriber) return UnsubscribeResponses.EMAIL_DOES_NOT_EXIST;
    if (!existingSubscriber.subscribedAt) return UnsubscribeResponses.ALREADY_UNSUBSCRIBED;

    await db.newsletterSubscriber.update({
        where: {
            email: existingSubscriber.email
        },
        data: {
            isVerified: true,
            unsubscribedAt: new Date(),
            subscribedAt: null
        }
    }).catch((error) => {
        throw new Error("Error unsubscribing user");
    })

    sendUnsubscriptionConfirmationEmail(existingSubscriber.email, existingSubscriber.id);

    return UnsubscribeResponses.UNSUBSCRIBED;
};