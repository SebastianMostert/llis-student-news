"use client";
import { useRouter } from "next/navigation";
import { PostWithAuthor } from "@/types";
import { useTranslations } from "next-intl";

type Props = {
    article: PostWithAuthor;
}

const ReadMoreButton = ({ article }: Props) => {
    const t = useTranslations('ReadMoreButton');
    const router = useRouter();

    const handleClick = () => {
        router.push(`/article/${article.slug}`);
    };
    
    return (
        <button
            onClick={handleClick}
            className='bg-accent-light dark:bg-accent-dark text-white h-10 rounded-b-lg hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark'
        >
            {t('readMore')}
        </button>
    )
}

export default ReadMoreButton