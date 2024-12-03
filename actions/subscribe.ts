"use server";

import { sendSubscriptionConfirmationEmail } from "@/lib/mail";
import { db } from "@/lib/db";
import { SendCodeResponses, SubscribeResponses } from "@/types";

export async function subscribe(email: string) {
    // Check if the email belongs to a user
    const existingUser = await db.user.findUnique({
        where: { email },
        select: {
            id: true,
            emailVerified: true,
            NewsletterSubscriber: {
                select: {
                    id: true,
                    isVerified: true,
                    email: true,
                },
            },
        },
    });

    // Check if the email belongs to a standalone subscriber
    const existingSubscriber = await db.newsletterSubscriber.findUnique({
        where: { email },
        select: {
            id: true,
            isVerified: true,
            subscribedAt: true,
        },
    });

    if (!existingUser && !existingSubscriber) {
        return SubscribeResponses.EMAIL_DOES_NOT_EXIST;
    }

    if (existingUser) {
        const { emailVerified, NewsletterSubscriber } = existingUser;
        const currentSubscriber = NewsletterSubscriber.find((subscriber) => subscriber.email === email);

        if (!emailVerified) {
            return SubscribeResponses.EMAIL_NOT_VERIFIED;
        }
        if (!currentSubscriber || !currentSubscriber.isVerified) {
            return SubscribeResponses.EMAIL_NOT_VERIFIED;
        }

        console.log("Here 1")
        // Link or create a subscriber entry for the user
        await db.newsletterSubscriber.upsert({
            where: { email },
            update: { isVerified: true, subscribedAt: new Date() },
            create: {
                email,
                isVerified: true,
                userId: existingUser.id,
                subscribedAt: new Date(),
            },
        });

        // Send confirmation email
        sendSubscriptionConfirmationEmail(email, currentSubscriber.id);
        return SubscribeResponses.SUBSCRIBED;
    }

    if (existingSubscriber) {
        if (!existingSubscriber.isVerified) {
            return SubscribeResponses.EMAIL_NOT_VERIFIED;
        }
        if (existingSubscriber.subscribedAt) {
            console.log({ existingSubscriber });
            return SubscribeResponses.ALREADY_SUBSCRIBED;
        }

        // Update standalone subscriber’s subscription status
        await db.newsletterSubscriber.update({
            where: { id: existingSubscriber.id },
            data: { subscribedAt: new Date() },
        });

        // Send confirmation email
        sendSubscriptionConfirmationEmail(email, existingSubscriber.id);
        return SubscribeResponses.SUBSCRIBED;
    }

    // Fallback response
    return SubscribeResponses.ERROR;
}

export async function subscribeWithId(id: string) {
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

    if (!existingSubscriber) return SubscribeResponses.EMAIL_DOES_NOT_EXIST;
    if (existingSubscriber.subscribedAt) return SubscribeResponses.ALREADY_SUBSCRIBED;
    if (!existingSubscriber.isVerified) return SubscribeResponses.EMAIL_NOT_VERIFIED;

    await db.newsletterSubscriber.update({
        where: { id },
        data: {
            subscribedAt: new Date(),
        }
    }).catch((error) => {
        throw new Error("Error subscribing user");
    });

    sendSubscriptionConfirmationEmail(existingSubscriber.email, existingSubscriber.id);
    return SubscribeResponses.SUBSCRIBED;
}