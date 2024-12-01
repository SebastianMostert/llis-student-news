"use client";
import { getProviders, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react'

const SignInButtons = ({ action }: { action: 'subscribe' | 'login' }) => {
    const [providers, setProviders] = useState<{ id: string; name: string }[] | null>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            if (!res) return;
            const resFiltered = Object.values(res).map((provider) => ({ id: provider.id, name: provider.name }));
            setProviders(resFiltered);
        };

        fetchProviders();
    }, []);

    if (!providers) return null;

    return (
        <div className="flex flex-col space-y-2">
            {Object.values(providers).map((provider) => (
                <button
                    key={provider.id}
                    onClick={() => signIn(provider.id)}
                    className="px-4 py-2 text-white rounded-md bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark focus:outline-none"
                >
                    {action === 'subscribe' ? 'Subscribe' : 'Sign in'} using {provider.name}
                </button>
            ))}
        </div>
    )
}

export default SignInButtons