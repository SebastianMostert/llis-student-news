import NewsList from "@/components/NewsList";
import { categories } from "@/constants";
import { fetchNews } from "@/lib/fetchNews";

async function NewsCategoryPage({ params }: { params: Promise<{ [key: string]: string }> }) {
    const awaitedParams = await params;
    const category = awaitedParams.category;

    const news = await fetchNews([category]);
    return (
        <div>
            <h1 className="headerTitle">{category}</h1>
            <NewsList news={news} />
        </div>
    )
}

export default NewsCategoryPage

export async function generateStaticParams() {
    return categories.map(category => ({
        category
    }))
}