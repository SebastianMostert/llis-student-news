"use server";

import { db } from "@/lib/db";
const formatCategory = (category: string) => category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

export async function getTranslatedCategory(locale: string, category: string) {
    try {
        const translation = await db.translation.findUnique({
            where: {
                locale_key: {
                    locale: locale,
                    key: `category_${category.toLowerCase()}`,
                },
            },
        });

        // If translation not found, return the category name as fallback
        const finalCategory = formatCategory(translation?.value ?? category);
        return finalCategory;
    } catch (error) {
        console.error("Error fetching translation:", error);
        return category;
    }
}

export async function getTranslatedPostTitle(locale: string, postId: string) {
    try {
        const translation = await db.translation.findUnique({
            where: {
                locale_key: {
                    locale: locale,
                    key: `post_title_${postId}`,
                },
            },
        });

        return translation?.value;
    } catch (error) {
        console.error("Error fetching translation:", error);
        return undefined;
    }
}

export async function getTranslatedPostDescription(locale: string, postId: string) {
    try {
        const translation = await db.translation.findUnique({
            where: {
                locale_key: {
                    locale: locale,
                    key: `post_description_${postId}`,
                },
            },
        });

        return translation?.value;
    } catch (error) {
        console.error("Error fetching translation:", error);
        return undefined;
    }
}