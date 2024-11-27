import { Category } from '@prisma/client';
import Link from 'next/link';
import React from 'react'

type Props = {
    category: Category;
    isActive: boolean;
}

const NavLink = ({ category, isActive }: Props) => {
    return (
        <Link
            href={`/news/${category.slug}`}
            className={`navLink ${isActive && 'underline decoration-accent-light dark:decoration-accent-dark underline-offset-4 font-bold text-lg'}`}
        >
            {category.name}
        </Link>
    )
}

export default NavLink