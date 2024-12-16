"use client";

import { useState } from 'react';
import { sendVerificationCode } from '@/actions/sendVerificationCode';
import { newVerification } from '@/actions/newVerification';
import { subscribe } from '@/actions/subscribe';
import { NewVerificationResponses, SendCodeResponses, SubscribeResponses } from '@/types';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

function subscribeFooter() {
    const t = useTranslations('subscribeFooter');

    const [email, setEmail] = useState('');
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
                        break;
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
        <div className="flex flex-col items-start w-full sm:w-auto">
            <h3 className="text-base font-semibold mb-2">{t('newsletter')}</h3>
            {!isCodeSent && !isVerified && !alreadyVerified && (
                <form
                    className="flex w-full max-w-xs space-x-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubscribe();
                    }}
                >
                    <input
                        type="text"
                        name="honeypot"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        className="hidden"
                        aria-hidden="true"
                        tabIndex={-1}
                    />
                    <input
                        type="email"
                        placeholder={t('newsletterPlaceholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 px-2 py-1 text-xs sm:text-sm bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="px-3 py-1 bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark rounded-md text-white text-xs sm:text-sm"
                    >
                        {t('subscribe')}
                    </button>
                </form>
            )}

            {isCodeSent && !isVerified && !alreadyVerified && (
                <div className="flex flex-col w-full max-w-xs">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={6}
                        placeholder={t('enterCode')}
                        className="mb-2 px-2 py-1 text-xs sm:text-sm bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none"
                    />
                    <button
                        onClick={handleVerifyCode}
                        className="px-3 py-1 bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark rounded-md text-white text-xs sm:text-sm"
                    >
                        {t('verifyCode')}
                    </button>
                </div>
            )}

            {isVerified && !alreadyVerified && (
                <p className="text-green-500 text-xs sm:text-sm">
                    {t('subscribed')}
                </p>
            )}

            {alreadyVerified && (
                <p className="text-orange-500 text-xs sm:text-sm">
                    {t('alreadySubscribed')}
                </p>
            )}
        </div>
    );
}

export default subscribeFooter;
