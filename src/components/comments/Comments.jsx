"use client";

import Link from "next/link";
import styles from "./comments.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Comment from "../Comment/Comment";
import { showToast } from "react-next-toast";

const fetcher = async (url) => {
    const res = await fetch(url);

    const data = await res.json();

    if (!res.ok) {
        const error = new Error(data.message);
        throw error;
    }

    return data;
};

const getUser = async () => {
    const res = await fetch('/api/user/', { cache: "no-store", });
    if (res.ok) return { data: await res.json(), authenticated: true };
    if (res.status === 401) return { data: null, authenticated: false };
    throw new Error();
};

const Comments = ({ postSlug }) => {
    const { status, data: userData } = useSession();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [desc, setDesc] = useState("");

    // TODO: The comments need to be validated before being sent
    // Once the user clicks on send, we verify the comment 

    useEffect(() => {
        getUser().then(({ data, authenticated }) => {
            if (!authenticated) return;
            setUser(data);
            setLoading(false);
        })
    }, [user]);

    const isLoggedIn = status === "authenticated";

    const { data, mutate, isLoading } = useSWR(
        `/api/comments?postSlug=${postSlug}`,
        fetcher
    );

    const handleSubmit = async () => {
        const res = await fetch("/api/comments", {
            method: "POST",
            body: JSON.stringify({ desc, postSlug }),
        });

        const data = await res.json();

        if (!res.ok) {
            showToast.error(data.message);
        }
        mutate();

        // Reset the form
        setDesc("");
    };

    if (loading) return null;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Comments</h1>
            {isLoggedIn ? (
                <div className={styles.write}>
                    <textarea
                        placeholder="Write a comment..."
                        className={styles.input}
                        onChange={(e) => setDesc(e.target.value)}
                        value={desc}
                    />
                    <button className={styles.button} onClick={handleSubmit}>
                        Send
                    </button>
                </div>
            ) : (
                <Link href="/login">Login to write a comment</Link>
            )}
            <div className={styles.comments}>
                {isLoading
                    ? null
                    : data?.map((item) => (
                        <Comment hasModButtons={true} hasEngagementButtons={true} mutate={mutate} item={item} key={item.id} isLoggedIn={isLoggedIn} user={user ? user : userData.user} />
                    ))}
            </div>
        </div>
    );
};

export default Comments;