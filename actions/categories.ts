"use server";

import { db } from "@/lib/db";
import { Category } from "@prisma/client";

export async function getCategories(): Promise<Category[]> {
    const categories = await db.category.findMany();
    return categories;
};