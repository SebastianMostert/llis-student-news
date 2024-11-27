import React, { useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { sendVerificationCode } from '@/actions/sendVerificationCode';
import { newVerification } from '@/actions/newVerification';
import { NewVerificationResponses, SendCodeResponses, SubscribeResponses } from '@/types';
import { subscribe } from '@/actions/subscribe';

const SubscribeForm = ({ email_ }: { email_?: string }) => {
    const [email, setEmail] = useState(email_ || '');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [alreadyVerified, setAlreadyVerified] = useState(false);
    const [honeypot, setHoneypot] = useState('');

    // Placeholder: Call backend API to handle subscription
    const handleSubscribe = async () => {
        // Honeypot validation: If the honeypot field is filled, block the submission
        if (honeypot) {
            console.log('Bot detected');
            return;
        }

        // Call API to send verification code
        const res = await sendVerificationCode({
            firstName: firstName || "Anonymous",
            lastName: lastName || "Anonymous",
            email,
        });

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
                        alert('Email does not exist');
                        break;
                    case SubscribeResponses.EMAIL_NOT_VERIFIED:
                        alert('Email not verified');
                        break;
                    case SubscribeResponses.SUBSCRIBED:
                        setIsVerified(true);
                        break;
                    default:
                        alert('Error subscribing');
                        break;
                }
                break;
            default:
                alert('Error sending code');
                break;
        }
    };

    // Placeholder: Call backend API to verify code
    const handleVerifyCode = async () => {
        // Call API to verify the code
        const verified = await newVerification(code);
        if (verified !== NewVerificationResponses.EMAIL_VERIFIED) alert(verified);
        if (verified == NewVerificationResponses.EMAIL_VERIFIED) {
            const res = await subscribe(email);
            switch (res) {
                case SubscribeResponses.ALREADY_SUBSCRIBED:
                    setAlreadyVerified(true);
                    break;
                case SubscribeResponses.EMAIL_DOES_NOT_EXIST:
                    alert('Email does not exist');
                    break;
                case SubscribeResponses.EMAIL_NOT_VERIFIED:
                    alert('Email not verified');
                    break;
                case SubscribeResponses.SUBSCRIBED:
                    setIsVerified(true);
                    break;
                default:
                    alert('Error subscribing');
                    break;
            }
        }
    };

    return (
        <div className="flex flex-col items-center bg-primaryBg-light dark:bg-primaryBg-dark p-6 rounded-md w-full sm:w-96 mx-auto">
            {/* Honeypot Field (Invisible to users) */}
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Subscribe to our Newsletter</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                        Stay updated with our latest news and updates. Enter your email to subscribe!
                    </p>

                    {/* First Name and Last Name Fields (Optional) */}
                    <div className="flex flex-col w-full mb-4">
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name (Optional)"
                            className="mb-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name (Optional)"
                            className="mb-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />

                        <button
                            onClick={handleSubscribe}
                            className="px-4 py-2 text-white rounded-md bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark focus:outline-none"
                        >
                            Subscribe
                        </button>
                    </div>
                </>
            )}

            {isCodeSent && !isVerified && !alreadyVerified && (
                <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Verify Your Email</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                        We've sent a 6-digit verification code to <span className="font-semibold">{email}</span>.
                    </p>
                    <div className="flex items-center w-full mb-4">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            placeholder="Enter your code"
                            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <button
                        onClick={handleVerifyCode}
                        className="px-4 py-2 text-white rounded-md bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark focus:outline-none"
                    >
                        Verify Code
                    </button>
                </>
            )}

            {isVerified && !alreadyVerified && (
                <>
                    <CheckCircleIcon className="h-12 w-12 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">You're Subscribed!</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
                        Thank you for subscribing. We're excited to share our updates with you!
                    </p>
                </>
            )}

            {alreadyVerified && (
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
};

export default SubscribeForm;
