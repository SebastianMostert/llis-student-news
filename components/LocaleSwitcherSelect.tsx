'use client';

import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { ChangeEvent, ReactNode, useTransition } from 'react';
import { Locale, usePathname, useRouter } from '@/i18n/routing';
import { HiOutlineChevronDown } from 'react-icons/hi'; // Simpler icon

type Props = {
    children: ReactNode;
    defaultValue: string;
    label: string;
};

export default function LocaleSwitcherSelect({
    children,
    defaultValue,
    label
}: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const params = useParams();

    function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const nextLocale = event.target.value as Locale;
        startTransition(() => {
            router.replace(
                // @ts-expect-error -- TypeScript will validate that only known `params`
                // are used in combination with a given `pathname`. Since the two will
                // always match for the current route, we can skip runtime checks.
                { pathname, params },
                { locale: nextLocale }
            );
        });
    }

    return (
        <label
            className={clsx(
                'relative dark:text-accent-dark text-accent-light',
                isPending && 'transition-opacity [&:disabled]:opacity-30',
            )}
        >
            <p className="sr-only">{label}</p>
            <select
                className={clsx(
                    'inline-flex appearance-none dark:bg-primaryBg-dark bg-primaryBg-light dark:text-white text-black rounded-lg py-3 pl-4 pr-10 focus:ring-2 focus:dark:ring-accent-dark focus:ring-accent-light focus:outline-none disabled:opacity-50',
                )}
                defaultValue={defaultValue}
                disabled={isPending}
                onChange={onSelectChange}
            >
                {children}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 dark:text-accent-dark text-accent-light">
                <HiOutlineChevronDown size={20} />
            </span>
        </label>
    );
}
