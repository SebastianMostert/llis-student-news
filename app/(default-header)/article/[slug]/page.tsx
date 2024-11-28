import LiveTimestamp from "@/components/LiveTimestamp";
import { PostWithAuthor } from "@/types";
import { db } from "@/lib/db";
import ArticleNotFound from "@/components/ArticleNotFound";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import removeMarkdown from "remove-markdown";

export async function generateMetadata({ params }: { params: Promise<{ [key: string]: string | undefined }> }) {
    const awaitedParams = await params;
    const { slug } = awaitedParams;

    const article: PostWithAuthor | null = await db.post.findUnique({
        where: { slug },
        include: { author: true },
    });

    if (!article) {
        return {
            title: "Article not found",
            description: "The requested article could not be found.",
        };
    }

    // Remove Markdown and limit to 150 characters for the description
    const plainTextContent = removeMarkdown(article.content).slice(0, 150);

    return {
        title: article.title,
        description: plainTextContent,
        openGraph: {
            title: article.title,
            description: plainTextContent,
            images: [
                {
                    url: article.imageUrl || "/default-image.png",
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
            images: [article.imageUrl || "/default-image.png"],
        },
    };
}

async function ArticlePage({ params }: { params: Promise<{ [key: string]: string | undefined }> }) {
    const awaitedParams = await params;
    const { slug } = awaitedParams;

    if (typeof slug !== "string") return <div>Loading...</div>;

    const article: PostWithAuthor | null = await db.post.findUnique({
        where: { slug },
        include: { author: true },
    });

    if (!article) {
        return <ArticleNotFound />;
    }

    return (
        <article>
            <section className="flex flex-col lg:flex-row pb-24 px-0 lg:px-10">
                {article.imageUrl && (
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-50 max-w-md mx-auto md:max-w-lg lg:max-w-xl object-cover rounded-lg shadow-md"
                    />
                )}

                <div className="px-10">
                    <h1 className="headerTitle px-0 no-underline pb-2">{article.title}</h1>

                    <div className="flex divide-x-2 space-x-4">
                        <h2 className="font-bold">By {article.author.firstName} {article.author.lastName}</h2>
                        <p className="pl-4"><LiveTimestamp time={article.createdAt} /></p>
                    </div>

                    {/* Render the Markdown content */}
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose dark:prose-invert pt-4">
                        {article.content}
                    </ReactMarkdown>
                </div>
            </section>
        </article>
    );
}

export default ArticlePage;
