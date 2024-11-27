"use client";

import NavLink from './NavLink';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCategories } from '@/actions/categories';
import { Category } from '@prisma/client';

const NavLinks = () => {
    const pathname = usePathname();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const isActive = (category: Category) => pathname?.split('/').pop() === category.slug;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <nav className='grid grid-cols-4 md:grid-cols-7 text-xs md:text-sm gap-4 pb-10 max-w-6xl mx-auto border-b'>
            {isLoading ? (
                <div className="navLink">Loading...</div>
            ) : (
                categories.map((category) => (
                    <NavLink
                        key={category.id}
                        category={category}
                        isActive={isActive(category)}
                    />
                ))
            )}
        </nav>
    );
};

export default NavLinks;
