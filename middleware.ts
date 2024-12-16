import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { getCookie, setCookie } from 'cookies-next/server';
import { getCookieConsentValue } from 'react-cookie-consent';

export default async function middleware(req: NextRequest) {
    // Step 1: Use the incoming request (example)
    const defaultLocale = req.headers.get('x-your-custom-locale') || 'en';

    // Step 2: Create and call the next-intl middleware (example)
    const handleI18nRouting = createMiddleware(routing);
    const response = handleI18nRouting(req);

    // Read the cookie consent value
    const cookieConsent = await getCookie("CookieConsent", { req, res: response });
    if (!cookieConsent) return response;

    // Step 3: Alter the response (example)
    response.headers.set('x-your-custom-locale', defaultLocale);

    // Here I do my own stuff
    // Check if I am currently in a /article page
    // We split the pathname into an array
    const pathname = req.nextUrl.pathname.split('/');
    // We get the before last element of the array
    const isArticle = pathname[pathname.length - 2] === 'article';
    const articleSlug = pathname[pathname.length - 1];

    if (isArticle) {
        const cookieName = "viewedArticles";
        const cookie = await getCookie(cookieName, { req, res: response });

        // Parse the cookie or initialize an empty object if it doesn't exist
        const viewedArticles = cookie ? JSON.parse(cookie) : {};

        // If the article isn't in the cookie yet, initialize it with a view count of 0
        if (viewedArticles[articleSlug] === undefined) {
            viewedArticles[articleSlug] = 0;
        } else {
            viewedArticles[articleSlug] = 1
        }

        // Update the cookie with the new view count for the article
        const viewedArticlesStr = JSON.stringify(viewedArticles);
        await setCookie(cookieName, viewedArticlesStr, { res: response, req });
    }


    return response;
}

export const config = {
    // Matcher entries are linked with a logical "or", therefore
    // if one of them matches, the middleware will be invoked.
    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        '/((?!api|_next|_vercel|.*\\..*).*)',
        // However, match all pathnames within `/users`, optionally with a locale prefix
        '/([\\w-]+)?/users/(.+)'
    ]
};