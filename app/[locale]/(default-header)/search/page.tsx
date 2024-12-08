import NewsList from "@/components/NewsList";
import { fetchNews } from "@/lib/fetchNews";
import { getTranslations } from 'next-intl/server';


async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const awaitedSearchParams = await searchParams;
    const t = await getTranslations('SearchPage');

    const news = await fetchNews(["general"], awaitedSearchParams?.q, true);

    return (
        <div>
            <h1 className="headerTitle">{t('resultsFor', { term: awaitedSearchParams?.q })}</h1>
            <NewsList news={news} />
        </div>
    )
}

export default SearchPage