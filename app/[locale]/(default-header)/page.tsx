import NewsList from "@/components/NewsList";
import { fetchNews } from "@/lib/fetchNews";

export const revalidate = 60; // Revalidate the page every 60 seconds (ISR)

async function Homepage() {
  const news = await fetchNews();

  return (
    <div>
      <NewsList news={news} />
    </div>
  );
}

export default Homepage;
