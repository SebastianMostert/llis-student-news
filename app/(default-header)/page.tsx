import NewsList from '@/components/NewsList';
import { fetchNews } from '@/lib/fetchNews';

async function Homepage() {
  const news = await fetchNews();

  return (
    <div>
      <NewsList news={news} />
    </div>
  )
}

export default Homepage