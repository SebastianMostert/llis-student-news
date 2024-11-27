"use server";

import sortNewsByImage from "./sortNewsByImage";
import { db } from "./db";
import { PostWithAuthor } from "@/types";

export const fetchNews = async (
    category?: string[],
    keywords?: string,
    isDynamic?: boolean
): Promise<PostWithAuthor[]> => {
    // Make a prisma query
    const dbData = await db.post.findMany({
        where: {
            content: {
                contains: keywords || undefined,
                mode: "insensitive",
            },
            category: {
                slug: {
                    in: category || undefined,
                },
            }
        },
        include: {
            author: true,
        },
        take: 20,
    });

    const news = sortNewsByImage(dbData);

    return news;
};