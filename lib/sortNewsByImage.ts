import { PostWithAuthor } from "@/types";

export default function sortNewsByImage(news: PostWithAuthor[]) {
    const data = news || []

    const newsWithImage = data.filter((article) => article.image !== null);
    const newsWithoutImage = data.filter((article) => article.image === null);

    const fixedNewsWithImage = newsWithImage.map((article) => {
        if(!article.image) return article;
        return {
            ...article,
            image: {
                ...article.image,
                content: Buffer.from(article.image.content).toString('base64'),
            },
        }
    })

    return [...fixedNewsWithImage, ...newsWithoutImage];
}