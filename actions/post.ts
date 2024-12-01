"use server";

import { db } from "@/lib/db";
import { Post } from "@prisma/client";

// the data shoould be the post excluding the id
export async function createPost(data: Omit<Post, "id">) {
    return await db.post.create({ data });
}


export async function checkSlugExists(slug: string) {
    const existingPost = await db.post.findFirst({
        where: {
            slug
        }
    });
    return new Promise<boolean>((resolve) => {
        if (existingPost) {
            resolve(true);
        } else {
            resolve(false);
        }
    })
}