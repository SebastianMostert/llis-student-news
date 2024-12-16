import "../globals.css";
import Providers from "@/Providers/Providers";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getTranslations } from "next-intl/server";
import { Toaster } from 'sonner'
import CookieConsentBanner from "@/components/CookieConsentBanner";

export async function generateMetadata({ params }: { params: Promise<{ [key: string]: string | undefined }> }) {

    const awaitedParams = await params;
    const { locale } = awaitedParams;

    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: t('title'),
        description: t('description'),
    }
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ [key: string]: string | undefined }>
}) {
    const awaitedParams = await params;
    const locale = awaitedParams.locale;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        return (
            <html lang="en" suppressHydrationWarning>
                <body>
                    <div>
                        404
                    </div>
                </body>
            </html>
        );
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className='bg-primaryBg-light dark:bg-primaryBg-dark transition-all duration-700'
            >
                <SessionProvider>
                    <Providers>
                        <NextIntlClientProvider messages={messages}>
                            <Toaster richColors position="bottom-right" />
                            <div>{children}</div>
                            <CookieConsentBanner />
                        </NextIntlClientProvider>
                    </Providers>
                </SessionProvider>
            </body>
        </html>
    );
}
