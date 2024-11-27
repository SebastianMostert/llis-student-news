import { unsubscribe } from '@/actions/unsubscribe';
import { UnsubscribeResponses } from '@/types';
import Link from 'next/link';

enum Status {
    UNSUBSCRIBED = 'unsubscribed',
    ALREADY_UNSUBSCRIBED = 'already_unsubscribed',
    FAILURE = 'failure',
    MISSING_ID = 'missing_id',
    ERROR = 'error',
}

async function SubscribePage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const id = searchParams.id;

    let status = Status.FAILURE;
    let message = "";

    if (!id) {
        status = Status.MISSING_ID;
        message = 'Missing ID parameter';
    }

    if (id) {
        try {
            const result = await unsubscribe(id);

            switch (result) {
                case UnsubscribeResponses.EMAIL_DOES_NOT_EXIST:
                    status = Status.FAILURE;
                    message = "The email you are trying to unsubscribe does not exist.";
                    break;
                case UnsubscribeResponses.ALREADY_UNSUBSCRIBED:
                    status = Status.ALREADY_UNSUBSCRIBED;
                    message = "You have already unsubscribed.";
                    break;
                case UnsubscribeResponses.UNSUBSCRIBED:
                    status = Status.UNSUBSCRIBED;
                    message = "You have successfully unsubscribed.";
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
            Go to Homepage
        </Link>
    );

    switch (status) {
        case Status.UNSUBSCRIBED:
            content = (
                <div className="p-6 rounded-lg shadow-md primaryBg-light dark:primaryBg-dark">
                    <h1 className="text-2xl font-bold accent-light dark:accent-dark mb-4">You have successfully unsubscribed.</h1>
                    <p className="text-lg secondaryBg-light dark:secondaryBg-dark">
                        Thank you for updating your preferences. If this was a mistake, you can resubscribe at any time.
                    </p>
                    <HomeButton />
                </div>
            );
            break;
        case Status.ALREADY_UNSUBSCRIBED:
            content = (
                <div className="p-6 rounded-lg shadow-md primaryBg-light dark:primaryBg-dark">
                    <h1 className="text-2xl font-bold accent-light dark:accent-dark mb-4">You have already unsubscribed.</h1>
                    <p className="text-lg secondaryBg-light dark:secondaryBg-dark">
                        If you want to resubscribe, you can do so at any time on our website's homepage!
                    </p>
                    <HomeButton />
                </div>
            );
            break;
        case Status.FAILURE:
            content = (
                <div className="p-6 rounded-lg shadow-md primaryBg-light dark:primaryBg-dark">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Unsubscription Failed</h1>
                    <p className="text-lg secondaryBg-light dark:secondaryBg-dark">
                        We could not process your unsubscription. Please try again later or contact support.
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Error Message: {message}</p>
                    <HomeButton />
                </div>
            );
            break;
        case Status.MISSING_ID:
            content = (
                <div className="p-6 rounded-lg shadow-md primaryBg-light dark:primaryBg-dark">
                    <h1 className="text-2xl font-bold text-yellow-500 mb-4">Invalid Request</h1>
                    <p className="text-lg secondaryBg-light dark:secondaryBg-dark">
                        It seems like we didn't receive the necessary information to process your unsubscription.
                    </p>
                    <HomeButton />
                </div>
            );
            break;
        case Status.ERROR:
            content = (
                <div className="p-6 rounded-lg shadow-md primaryBg-light dark:primaryBg-dark">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h1>
                    <p className="text-lg secondaryBg-light dark:secondaryBg-dark">
                        We encountered an issue while processing your request. Please try again later.
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Error Message: {message}</p>
                    <HomeButton />
                </div>
            );
            break;
        default:
            content = (
                <div className="p-6 rounded-lg shadow-md primaryBg-light dark:primaryBg-dark">
                    <h1 className="text-2xl font-bold text-gray-500 mb-4">Unknown Status</h1>
                    <p className="text-lg secondaryBg-light dark:secondaryBg-dark">
                        We encountered an unexpected issue. Please try again later.
                    </p>
                    <HomeButton />
                </div>
            );
            break;
    }

    return <div className="flex justify-center items-center w-full h-full">{content}</div>;
}

export default SubscribePage;