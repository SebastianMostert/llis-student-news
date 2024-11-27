import React from 'react'
import Article from './Article'
import { Post, Prisma } from '@prisma/client'
import { PostWithAuthor } from '@/types';

type Props = {
    news: PostWithAuthor[];
};

const NewsList = ({ news }: Props) => {
    return (
        <main
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-10 gap-10'
        >
            {news.map((article) => (
                <div key={article.title}>
                    <Article article={article} />
                </div>
            ))}
        </main>
    )
}

export default NewsList