import React from 'react'
import ArticleLoader from './ArticleLoader'

const NewsListLoader = () => {
    return (
        <main
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-10 gap-10'
        >
            <ArticleLoader />
            <ArticleLoader />
            <ArticleLoader />
            <ArticleLoader />
            <ArticleLoader />
            <ArticleLoader />
            <ArticleLoader />
            <ArticleLoader />
            <ArticleLoader />
            <ArticleLoader />
            <ArticleLoader />
            <ArticleLoader />
        </main>
    )
}

export default NewsListLoader