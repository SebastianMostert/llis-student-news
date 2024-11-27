import React from 'react'
import ReadMoreButton from './ReadMoreButton'
import LiveTimestamp from './LiveTimestamp'
import { PostWithAuthor } from '@/types';


type Props = {
    article: PostWithAuthor;
};

const Article = ({ article }: Props) => {
    return (
        <article className='bg-secondaryBg-light dark:bg-secondaryBg-dark flex flex-col rounded-lg shadow-lg hover:scale-105 hover:shadow-lg hover:bg-slate-200 transition-all duration-200 ease-out'>
            {article.imageUrl && (
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className='h-56 w-full object-cover rounded-t-lg shadow'
                />
            )}

            <div className='flex-1 flex flex-col'>
                <div className='flex-1 flex flex-col p-5'>
                    <h2 className='font-bold font-serif'>{article.title}</h2>

                    <section className='flex-1 mt-2'>
                        <p className='text-sm line-clamp-6'>{article.content}</p>
                    </section>

                    <footer className='text-xs text-right ml-auto flex space-x-1 pt-5 italic text-gray-400'>
                        <p>{article.author.firstName} {article.author.lastName} -</p>
                        <p><LiveTimestamp time={article.createdAt} /></p>
                    </footer>
                </div>

                <ReadMoreButton article={article} />
            </div>
        </article>
    )
}

export default Article