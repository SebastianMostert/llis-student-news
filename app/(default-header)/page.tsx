import NewsList from '@/components/NewsList';
import ShowSubscribeFormOnHome from '@/components/ShowSubscribeFormOnHome';
import { fetchNews } from '@/lib/fetchNews';

async function Homepage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const awaitedParams = await searchParams;
  const subscribe = awaitedParams?.subscribe;
  const email = awaitedParams?.email;

  const news = await fetchNews();

  return (
    <div>
      <NewsList news={news} />

      {subscribe && <ShowSubscribeFormOnHome subscribe={Boolean(subscribe)} email={email} />}
    </div>
  )
}

export default Homepage