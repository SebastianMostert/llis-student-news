import NewsList from "@/components/NewsList";
import { fetchNews } from "@/lib/fetchNews";


async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const awaitedParams = await searchParams;

    const news = await fetchNews(["general"], awaitedParams?.q, true);

    return (
        <div>
            <h1 className="headerTitle">Search Results for: {awaitedParams?.q}</h1>
            <NewsList news={news} />
        </div>
    )
}

export default SearchPage