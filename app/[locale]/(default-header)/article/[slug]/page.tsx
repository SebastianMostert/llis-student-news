import LiveTimestamp from "@/components/LiveTimestamp";
import { PostWithAuthor } from "@/types";
import { db } from "@/lib/db";
import ArticleNotFound from "@/components/ArticleNotFound";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from 'remark-gfm'
import removeMarkdown from "remove-markdown";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ [key: string]: string | undefined }> }) {
    const t = await getTranslations('ArticlePage');
    const awaitedParams = await params;
    const { slug } = awaitedParams;

    const article: PostWithAuthor | null = await db.post.findUnique({
        where: { slug },
        include: { author: true, image: true },
    });

    if (!article) {
        return {
            title: t('articleNotFound'),
            description: t('articleNotFoundDescription'),
        };
    }

    // Remove Markdown and limit to 150 characters for the description
    const plainTextContent = removeMarkdown(article.content).slice(0, 150);

    const fixedImage = {
        image: article.image
            ? {
                ...article.image,
                content: Buffer.from(article.image.content).toString("base64"),
            }
            : null,
    }

    return {
        title: article.title,
        description: plainTextContent,
        openGraph: {
            title: article.title,
            description: plainTextContent,
            images: [
                {
                    url: fixedImage.image?.content,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: plainTextContent,
            images: [fixedImage.image?.content],
        },
    };
}

async function ArticlePage({ params }: { params: Promise<{ [key: string]: string | undefined }> }) {
    const t = await getTranslations('ArticlePage');
    const awaitedParams = await params;
    const { slug } = awaitedParams;

    if (typeof slug !== "string") return <div>{t('loading')}</div>;

    const article: PostWithAuthor | null = await db.post.findUnique({
        where: { slug },
        include: { author: true, image: true },
    });

    if (!article) {
        return <ArticleNotFound />;
    }

    const fixedImage = {
        image: article.image
            ? {
                ...article.image,
                content: Buffer.from(article.image.content).toString("base64"),
            }
            : null,
    }

    const authorName = `${article.author.firstName} ${article.author.lastName}`

    return (
        <article>
            <section className="flex flex-col lg:flex-row pb-24 px-0 lg:px-10">
                {fixedImage.image && (
                    <img
                        src={`data:${fixedImage.image.mimeType};base64,${fixedImage.image.content}`}
                        alt={article.title}
                        className="h-50 max-w-md mx-auto md:max-w-lg lg:max-w-xl object-cover rounded-lg shadow-md"
                    />
                )}

                <div className="px-10">
                    <h1 className="headerTitle px-0 no-underline pb-2">{article.title}</h1>

                    <div className="flex divide-x-2 space-x-4">
                        <h2 className="font-bold">{t('by', { name: authorName })}</h2>
                        <p className="pl-4"><LiveTimestamp time={article.createdAt} /></p>
                    </div>

                    {/* Render the Markdown content */}
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} className="prose dark:prose-invert pt-4">
                        {article.content}
                    </ReactMarkdown>
                </div>
            </section>
        </article>
    );
}

export default ArticlePage;
