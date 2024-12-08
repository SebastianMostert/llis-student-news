import NewsList from "@/components/NewsList";
import { categories } from "@/constants";
import { fetchNews } from "@/lib/fetchNews";
import { Metadata } from "next";
import { PrismaClient } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";
import { getTranslatedCategory } from "@/lib/translations";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function generateMetadata({
    params,
}: {
    params: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> {
    const t = await getTranslations('NewsCategoryPage');
    const locale = await getLocale();

    const awaitedParams = await params;
    const category = awaitedParams.category;

    if (!category) {
        return {
            title: t('noCategoryFound'),
            applicationName: "Keeping up with LLIS",
        };
    }

    const translatedCategory = await getTranslatedCategory(locale, category);

    const title = t('title', { category: translatedCategory });
    const description = t('description', { category: translatedCategory });

    return {
        title: title,
        description: description,
        alternates: {
            canonical: `/${awaitedParams.locale}/news/${category}`,
            languages: {
                en: `/en/news/${category}`,
                de: `/de/news/${category}`,
            },
        },
        applicationName: "Keeping up with LLIS",
    };
}

async function NewsCategoryPage({
    params,
}: {
    params: Promise<{ [key: string]: string }>;
}) {
    const awaitedParams = await params;
    const { category, locale } = awaitedParams;

    // Fetch news for the selected category
    const news = await fetchNews([category]);

    // Fetch the translated category name
    const translatedCategory = await getTranslatedCategory(locale, category);

    return (
        <div>
            <h1 className="headerTitle">{translatedCategory}</h1>
            <NewsList news={news} />
        </div>
    );
}

export default NewsCategoryPage;

export async function generateStaticParams() {
    return categories.map((category) => ({
        category,
    }));
}
