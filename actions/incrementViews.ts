"use server";

import { cookies } from 'next/headers';
import { getCookie, setCookie } from "cookies-next/server";
import { db } from "@/lib/db";

export async function incrementPostView(postSlug: string) {
    const cookie = await getCookie("viewedArticles", { cookies });
    const viewedArticles = cookie ? JSON.parse(cookie) : [];

    const articleIsInCookie = viewedArticles[postSlug];

    if (articleIsInCookie === undefined) return;
    
    // Only increment the view count if it is 0
    if (articleIsInCookie === 0) {;
        // Update the post views to increment by 1
        await db.post.update({
            where: { slug: postSlug },
            data: { views: { increment: 1 } },
        });
    }
}
