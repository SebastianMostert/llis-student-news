import { getTranslatedCategory } from '@/lib/translations';
import { Category } from '@prisma/client';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import React, { useEffect } from 'react'

type Props = {
    category: Category;
    isActive: boolean;
}

function NavLink({ category, isActive }: Props) {
    const [translatedCategory, setTranslatedCategory] = React.useState(category.name);
    const locale = useLocale();

    useEffect(() => {
        const fetchTranslatedCategory = async () => {
            try {
                const translated = await getTranslatedCategory(locale, category.name);
                setTranslatedCategory(translated);
            } catch (error) {
                console.error("Error fetching translation:", error);
            }
        };

        fetchTranslatedCategory();
    }, [])


    return (
        <Link
            href={`/news/${category.slug}`}
            className={`navLink ${isActive && 'underline decoration-accent-light dark:decoration-accent-dark underline-offset-4 font-bold text-lg'}`}
        >
            {translatedCategory}
        </Link>
    )
}

export default NavLink