import { PostWithAuthor } from "@/types";

export default function sortNewsByImage(news: PostWithAuthor[]) {
    const data = news || []

    const newsWithImage = data.filter((article) => article.imageUrl !== null);
    const newsWithoutImage = data.filter((article) => article.imageUrl === null);

    return [...newsWithImage, ...newsWithoutImage];
}