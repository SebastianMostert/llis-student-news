"use client";

import React, { useState } from 'react';
import ModalSubscribe from './ModalSubscribe';

const SubscribeBtn = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            {/* Subscribe Button */}
            <button
                onClick={() => setIsModalOpen((prev) => !prev)}
                className="hidden md:inline bg-accent-light text-white px-4 lg:px-8 py-2 lg:py-4 rounded-full dark:bg-accent-dark"
            >
                Subscribe Now
            </button>

            {/* Modal Overlay */}
            <ModalSubscribe isOpen={isModalOpen} closeModal={() => setIsModalOpen((prev) => !prev)} />
        </div>
    );
};

export default SubscribeBtn;
