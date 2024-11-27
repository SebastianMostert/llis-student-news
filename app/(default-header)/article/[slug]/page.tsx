import LiveTimestamp from "@/components/LiveTimestamp";
import { PostWithAuthor } from "@/types";
import { db } from "@/lib/db";
import ArticleNotFound from "@/components/ArticleNotFound";

export async function generateMetadata({ params }: { params: Promise<{ [key: string]: string | undefined }> }) {
    const awaitedParams = await params;
    const { slug } = awaitedParams;

    // Fetch the article to generate metadata
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

    return {
        title: article.title,
        description: article.content.slice(0, 150), // Limit description to 150 characters
        openGraph: {
            title: article.title,
            description: article.content.slice(0, 150),
            images: [
                {
                    url: article.imageUrl, // Use a default image if none is provided
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
            description: article.content.slice(0, 150),
            images: [article.imageUrl],
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
                        className='h-50 max-w-md mx-auto md:max-w-lg lg:max-w-xl object-cover rounded-lg shadow-md'
                    />
                )}

                <div className="px-10">
                    <h1 className="headerTitle px-0 no-underline pb-2">{article.title}</h1>

                    <div className="flex divide-x-2 space-x-4">
                        <h2 className="font-bold">By {article.author.firstName} {article.author.lastName}</h2>
                        <p className="pl-4"><LiveTimestamp time={article.createdAt} /></p>
                    </div>

                    <p className="pt-4">{article.content}</p>
                </div>

            </section>
        </article>
    )
}

export default ArticlePage