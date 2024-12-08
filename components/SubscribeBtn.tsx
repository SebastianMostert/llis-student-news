"use client";

import React, { useState } from 'react';
import ModalSubscribe from './ModalSubscribe';
import { unsubscribeWithEmail } from '@/actions/unsubscribe';
import { UnsubscribeResponses } from '@/types';
import { useTranslations } from 'next-intl';

const SubscribeBtn = ({ userEmail, isSubscribed }: { userEmail?: string; isSubscribed: boolean }) => {
    const t = useTranslations('SubscribeBtn');
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (userEmail == undefined && isSubscribed) return <div>{t('authError', { isSubscribed })}</div>

    const handleClick = async () => {
        if (!isSubscribed) setIsModalOpen((prev) => !prev);
        else {
            if (!userEmail) return
            // Invoke unsubscribe server action
            const res = await unsubscribeWithEmail(userEmail);
            switch (res) {
                case UnsubscribeResponses.EMAIL_DOES_NOT_EXIST:
                    alert('Email does not exist.');
                    break;
                case UnsubscribeResponses.ALREADY_UNSUBSCRIBED:
                    alert('You are already unsubscribed.');
                    break;
                case UnsubscribeResponses.UNSUBSCRIBED:
                    window.location.reload();
                    break;
                default:
                    alert('Error unsubscribing.');
            }
        }
    };

    return (
        <div>
            {/* Subscribe Button */}
            <button
                onClick={handleClick}
                className="hidden md:inline bg-accent-light text-white px-4 lg:px-8 py-2 lg:py-4 rounded-full dark:bg-accent-dark"
            >
                {isSubscribed ? t('unsubscribeNow') : t('subscribeNow')}
            </button>

            {/* Modal Overlay */}
            <ModalSubscribe isOpen={isModalOpen} closeModal={() => setIsModalOpen((prev) => !prev)} email={userEmail} />
        </div>
    );
};

export default SubscribeBtn;
