import { unsubscribe } from '@/actions/unsubscribe';
import { UnsubscribeResponses } from '@/types';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

enum Status {
    UNSUBSCRIBED = 'unsubscribed',
    ALREADY_UNSUBSCRIBED = 'already_unsubscribed',
    FAILURE = 'failure',
    MISSING_ID = 'missing_id',
    ERROR = 'error',
}

async function SubscribePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const t = await getTranslations('UnsubscribePage');

    const awaitedSearchParams = await searchParams;
    const id = awaitedSearchParams.id;

    let status = Status.FAILURE;
    let message = "";

    if (!id) {
        status = Status.MISSING_ID;
        message = t("missingId");
    }

    if (id) {
        try {
            const result = await unsubscribe(id);

            switch (result) {
                case UnsubscribeResponses.EMAIL_DOES_NOT_EXIST:
                    status = Status.FAILURE;
                    message = t("emailNotFound");
                    break;
                case UnsubscribeResponses.ALREADY_UNSUBSCRIBED:
                    status = Status.ALREADY_UNSUBSCRIBED;
                    message = t("alreadyUnsubscribed");
                    break;
                case UnsubscribeResponses.UNSUBSCRIBED:
                    status = Status.UNSUBSCRIBED;
                    message = t("successfullyUnsubscribed");
                    break;
            }
        } catch (error: any) {
            status = Status.ERROR;
            message = error.message;
        }
    }

    let content;

    const HomeButton = () => (
        <Link href="/" className="mt-4 inline-block px-4 py-2 text-white bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark rounded">
            {t("goToHomepage")}
        </Link>
    );

    switch (status) {
        case Status.UNSUBSCRIBED:
            content = (
                <div className="p-6 rounded-lg shadow-md primaryBg-light dark:primaryBg-dark">
                    <h1 className="text-2xl font-bold accent-light dark:accent-dark mb-4">{t("successfullyUnsubscribed")}</h1>
                    <p className="text-lg secondaryBg-light dark:secondaryBg-dark">
                        {t("thankYou")}
                    </p>
                    <HomeButton />
                </div>
            );
            break;
        case Status.ALREADY_UNSUBSCRIBED:
            content = (
                <div className="p-6 rounded-lg shadow-md primaryBg-light dark:primaryBg-dark">
                    <h1 className="text-2xl font-bold accent-light dark:accent-dark mb-4">{t("alreadyUnsubscribed")}</h1>
                    <p className="text-lg secondaryBg-light dark:secondaryBg-dark">
                        {t("resubscribe")}
                    </p>
                    <HomeButton />
                </div>
            );
            break;
        case Status.FAILURE:
            content = (
                <div className="p-6 rounded-lg shadow-md primaryBg-light dark:primaryBg-dark">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">{t("unsubscriptionFailed")}</h1>
                    <p className="text-lg secondaryBg-light dark:secondaryBg-dark">
                        {t("couldNotProcess")}
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("error", { message })}</p>
                    <HomeButton />
                </div>
            );
            break;
        case Status.MISSING_ID:
            content = (
                <div className="p-6 rounded-lg shadow-md primaryBg-light dark:primaryBg-dark">
                    <h1 className="text-2xl font-bold text-yellow-500 mb-4">{t("invalidRequest")}</h1>
                    <p className="text-lg secondaryBg-light dark:secondaryBg-dark">
                        {t("informationMissing")}
                    </p>
                    <HomeButton />
                </div>
            );
            break;
        case Status.ERROR:
            content = (
                <div className="p-6 rounded-lg shadow-md primaryBg-light dark:primaryBg-dark">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">{t("errorOccurred")}</h1>
                    <p className="text-lg secondaryBg-light dark:secondaryBg-dark">
                        {t("processingError")}
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("error", { message })}</p>
                    <HomeButton />
                </div>
            );
            break;
        default:
            content = (
                <div className="p-6 rounded-lg shadow-md primaryBg-light dark:primaryBg-dark">
                    <h1 className="text-2xl font-bold text-gray-500 mb-4">{t("unknownStatus")}</h1>
                    <p className="text-lg secondaryBg-light dark:secondaryBg-dark">
                        {t("unexpectedIssue")}
                    </p>
                    <HomeButton />
                </div>
            );
            break;
    }

    return <div className="flex justify-center items-center w-full h-full">{content}</div>;
}

export default SubscribePage;