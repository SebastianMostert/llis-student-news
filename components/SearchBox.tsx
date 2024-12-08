"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchBox = () => {
    const t = useTranslations('SearchBox');
    const [input, setInput] = useState<string>('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input) return;
        
        router.push(`/search?q=${input}`);
    }

    return (
        <form
            onSubmit={handleSearch}
            className='max-w-6xl mx-auto flex justify-between items-center px-5'
        >
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('placeholder')}
                className='w-full h-14 rounded-sm placeholder-gray-500 outline-none flex-1 bg-transparent text-accent-light dark:text-accent-dark'
            />

            <button
                type="submit"
                disabled={!input}
                className='text-accent-light dark:text-accent-dark disabled:text-gray-400'
            >
                {t('search')}
            </button>
        </form>
    )
}

export default SearchBox