"use client"

import React, { useEffect, useState } from 'react'
import styles from './adminPage.module.css'
import { useRouter } from 'next/navigation';
import { FaComment, FaNewspaper, FaUsers } from 'react-icons/fa';

const getData = async () => {
    const res = await fetch('/api/user/', {
        cache: "no-store",
    });

    if (res.ok) return { data: await res.json(), authenticated: true };
    else if (res.status === 401) return { data: null, authenticated: false };
    else throw new Error();
};

const cardData = [
    {
        title: "Posts",
        url: "/admin/posts",
        description: "See all posts, delete them, select featured posts and choose editors pick",
        icon: <FaNewspaper className={styles.icon} />,
    },
    {
        title: "Comments",
        url: "/admin/comments",
        description: "See the comments that have been flagged by users or the AI",
        icon: <FaComment className={styles.icon} />,
    },
    {
        title: "Users",
        url: "/admin/users",
        description: "See all users and delete them or edit their roles",
        icon: <FaUsers className={styles.icon} />,
    },
];

const AdminPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        getData().then(({ data, authenticated }) => {
            if (!authenticated) router.push("/login");
            setUser(data);
            setLoading(false);
        });
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const isAdmin = user?.roles.includes("admin");

    if (!isAdmin) {
        router.push("/");
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>Admin Dashboard</div>
            {isAdmin ? (
                <div>
                    <div className={styles.subheader}>Manage your site&apos;s content</div>
                    <div className={styles.cardContainer}>
                        {cardData.map((card, index) => (
                            <div key={index} className={styles.card} onClick={() => router.push(card.url)}>
                                {card.icon}
                                <h3>{card.title}</h3>
                                <p>{card.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    If you are seeing this, something has gone terribly wrong. Please contact the developer immediately and explain your situation.
                </div>
            )}
        </div>
    );
};

export default AdminPage;
