import { getTranslations } from 'next-intl/server';
import React from 'react'

async function ArticleNotFound() {
    const t = await getTranslations('ArticleNotFound');

    return (
        <div>{t('articleNotFound')}</div>
    )
}

export default ArticleNotFound