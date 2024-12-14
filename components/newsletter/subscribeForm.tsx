"use client";

import { useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { sendVerificationCode } from '@/actions/sendVerificationCode';
import { newVerification } from '@/actions/newVerification';
import { NewVerificationResponses, SendCodeResponses, SubscribeResponses } from '@/types';
import { subscribe } from '@/actions/subscribe';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

const SubscribeForm = ({ email_ }: { email_?: string }) => {
    const t = useTranslations('SubscribeForm');

    const [email, setEmail] = useState(email_ || '');
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [alreadyVerified, setAlreadyVerified] = useState(false);
    const [honeypot, setHoneypot] = useState('');

    const handleSubscribe = async () => {
        if (honeypot) return;

        const res = await sendVerificationCode({ email });

        switch (res) {
            case SendCodeResponses.CODE_SENT:
                setIsCodeSent(true);
                break;
            case SendCodeResponses.EMAIL_ALREADY_VERIFIED:
                const res = await subscribe(email);
                switch (res) {
                    case SubscribeResponses.ALREADY_SUBSCRIBED:
                        setAlreadyVerified(true);
                        break;
                    case SubscribeResponses.EMAIL_DOES_NOT_EXIST:
                        toast.error(t('emailDoesNotExist'));
                        break;
                    case SubscribeResponses.EMAIL_NOT_VERIFIED:
                        toast.error(t('emailNotVerified'));
                    case SubscribeResponses.SUBSCRIBED:
                        setIsVerified(true);
                        break;
                    default:
                        toast.error(t('errorSubscribing'));
                        break;
                }
                break;
            default:
                toast.error(t('errorSendingCode'));
                break;
        }
    };

    const handleVerifyCode = async () => {
        const verified = await newVerification(code);
        if (verified !== NewVerificationResponses.EMAIL_VERIFIED) {
            switch (verified) {
                case NewVerificationResponses.INVALID_TOKEN:
                    toast.error(t('invalidToken'));
                    break;
                case NewVerificationResponses.TOKEN_EXPIRED:
                    toast.error(t('tokenExpired'));
                    break;
                case NewVerificationResponses.EMAIL_DOES_NOT_EXIST:
                    toast.error(t('emailDoesNotExist'));
                    break;
                default:
                    toast.error(t('errorVerifyingCode'));
                    break;
            }
        }
        if (verified === NewVerificationResponses.EMAIL_VERIFIED) {
            const res = await subscribe(email);
            switch (res) {
                case SubscribeResponses.ALREADY_SUBSCRIBED:
                    setAlreadyVerified(true);
                    break;
                case SubscribeResponses.EMAIL_DOES_NOT_EXIST:
                    toast.error(t('emailDoesNotExist'));
                    break;
                case SubscribeResponses.EMAIL_NOT_VERIFIED:
                    toast.error(t('emailNotVerified'));
                    break;
                case SubscribeResponses.SUBSCRIBED:
                    setIsVerified(true);
                    break;
                default:
                    toast.error(t('errorSubscribing'));
                    break;
            }
        }
    };

    return (
        <div className="flex flex-col items-center bg-primaryBg-light dark:bg-primaryBg-dark p-6 rounded-md w-full sm:w-96 mx-auto">
            <input
                type="text"
                name="honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
            />

            {!isCodeSent && !isVerified && !alreadyVerified && (
                <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("subscribeToNewsletter")}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                        {t("subscribeDescription")}
                    </p>
                    <div className="flex flex-col w-full mb-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("enterEmail")}
                            className="mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <button
                            onClick={handleSubscribe}
                            className="px-4 py-2 text-white rounded-md bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark focus:outline-none"
                        >
                            {t("subscribe")}
                        </button>
                    </div>
                </>
            )}

            {isCodeSent && !isVerified && !alreadyVerified && (
                <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("verifyEmail")}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                        {t("verifyEmail", { email })}
                    </p>
                    <div className="flex items-center w-full mb-4">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            placeholder={t("enterCode")}
                            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <button
                        onClick={handleVerifyCode}
                        className="px-4 py-2 text-white rounded-md bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark focus:outline-none"
                    >
                        {t("verifyCode")}
                    </button>
                </>
            )}

            {isVerified && !alreadyVerified && (
                <>
                    <CheckCircleIcon className="h-12 w-12 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("subscribed")}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
                        {t("thankYou")}
                    </p>
                </>
            )}

            {alreadyVerified && (
                <>
                    <ExclamationCircleIcon className="h-12 w-12 text-orange-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("alreadySubscribed")}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
                        {t("thankYou")}
                    </p>
                </>
            )}
        </div>
    );
};

export default SubscribeForm;
