"use client";

import SubscribeForm from '@/components/newsletter/subscribeForm';

export default function SubscribePage() {
    return (
        <div className="flex items-center justify-center">
            <div className="bg-primaryBg-light dark:bg-primaryBg-dark p-8 rounded-lg max-w-lg w-full">
                {/* Subscribe Form */}
                <SubscribeForm />
            </div>
        </div>
    );
}
