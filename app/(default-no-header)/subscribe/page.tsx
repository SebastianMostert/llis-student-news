import { subscribeWithId } from '@/actions/subscribe';
import SubscribeForm from '@/components/newsletter/subscribeForm';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { SubscribeResponses } from '@/types';

export default async function SubscribePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const awaitedParams = await searchParams;
    const resubscribeID = awaitedParams?.id;

    if (resubscribeID == undefined) {
        return (
            <div className="flex items-center justify-center">
                <div className="bg-primaryBg-light dark:bg-primaryBg-dark p-8 rounded-lg max-w-lg w-full">
                    {/* Subscribe Form */}
                    <SubscribeForm />
                </div>
            </div>
        );
    }

    const res = await subscribeWithId(resubscribeID);
    let isAlreadyVerified = false;
    let isVerified = false;

    switch (res) {
        case SubscribeResponses.ALREADY_SUBSCRIBED:
            isAlreadyVerified = true;
            break;
        case SubscribeResponses.SUBSCRIBED:
            isVerified = true;
            break;
        default:
            return (
                <div className="flex items-center justify-center">
                    <div className="bg-primaryBg-light dark:bg-primaryBg-dark p-8 rounded-lg max-w-lg w-full">
                        {/* Subscribe Form */}
                        <SubscribeForm />
                    </div>
                </div>
            );
    }

    return (
        <div className="flex flex-col items-center bg-primaryBg-light dark:bg-primaryBg-dark p-6 rounded-md w-full sm:w-96 mx-auto">
            {isVerified && !isAlreadyVerified && (
                <>
                    <CheckCircleIcon className="h-12 w-12 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">You're Subscribed!</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
                        Thank you for subscribing. We're excited to share our updates with you!
                    </p>
                </>
            )}

            {isAlreadyVerified && (
                <>
                    <ExclamationCircleIcon className="h-12 w-12 text-orange-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">You're already subscribed!</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
                        Thank you for subscribing. We're excited to share our updates with you!
                    </p>
                </>
            )}
        </div>
    );
}
