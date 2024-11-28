"use server";

import { db } from "@/lib/db";
import { Post } from "@prisma/client";

// the data shoould be the post excluding the id
export async function createPost(data: Omit<Post, "id">) {
    return await db.post.create({ data });
}