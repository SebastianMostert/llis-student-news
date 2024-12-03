"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function checkIfSubscribed({ email }: { email?: string }): Promise<boolean> {
    const session = await auth()
    const currentUser = session?.user
    const emailToCheck = email || currentUser?.email

    if (!emailToCheck) return false

    const subscriber = await db.newsletterSubscriber.findUnique({
        where: { email: emailToCheck },
        select: { subscribedAt: true },
    })

    return !!subscriber?.subscribedAt
};