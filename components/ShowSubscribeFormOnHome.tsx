"use client";

import { useState } from 'react'
import ModalSubscribe from './ModalSubscribe'
import { redirect } from 'next/navigation';

const ShowSubscribeFormOnHome = ({ subscribe, email }: { subscribe: boolean; email?: string }) => {
    const [isOpen, setIsOpen] = useState(subscribe);

    const closeModal = () => {
        setIsOpen(false);

        redirect('/');
    }

    return (
        <div>
            <ModalSubscribe isOpen={isOpen} closeModal={closeModal} email={email} />
        </div>
    )
}

export default ShowSubscribeFormOnHome