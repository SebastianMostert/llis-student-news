"use client";

import React, { MutableRefObject, useEffect, useRef } from 'react'
import SubscribeForm from './newsletter/subscribeForm';

const ModalSubscribe = ({ isOpen, closeModal, email }: { isOpen: boolean; closeModal: () => void; email?: string }) => {
    const modalRef: MutableRefObject<HTMLDivElement> | MutableRefObject<null> = useRef<HTMLDivElement>(null);

    // Close the modal if clicked outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const currentModalRef = modalRef.current;
            const eventTarget = event.target;

            if (!currentModalRef) return;
            if (!eventTarget) return;

            if (!currentModalRef.contains(eventTarget as Node)) closeModal();
        };

        // Add event listener for clicks outside of modal
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    {/* Modal Content */}
                    <div
                        ref={modalRef}
                        className="bg-primaryBg-light dark:bg-primaryBg-dark p-8 rounded-lg max-w-lg w-full relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none"
                        >
                            ✕
                        </button>

                        {/* Subscribe Form */}
                        <SubscribeForm email_={email} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ModalSubscribe