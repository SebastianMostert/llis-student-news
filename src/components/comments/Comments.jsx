"use client";

import Link from "next/link";
import styles from "./comments.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Comment from "../Comment/Comment";
import { showToast } from "react-next-toast";
import { checkPermissions } from "@/utils/checkPermissions";
import { Permissions } from "@/utils/constant";

const fetcher = async (url) => {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message);
    }

    return data;
};

const getUser = async () => {
    const res = await fetch('/api/user/', { cache: "no-store" });
    if (res.ok) return { data: await res.json(), authenticated: true };
    if (res.status === 401) return { data: null, authenticated: false };
    throw new Error('Failed to fetch user data');
};

const Comments = ({ postSlug }) => {
    const { status } = useSession();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [permissions, setPermissions] = useState({
        isMod: false,
        canEngage: false,
        canComment: false,
    });
    const [desc, setDesc] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, authenticated } = await getUser();
                if (!authenticated) return;

                setUser(data);

                const permissionsToCheck = [
                    { key: 'isMod', permissions: [Permissions.DeleteComments] },
                    { key: 'canEngage', permissions: [Permissions.EngageComments] },
                    { key: 'canComment', permissions: [Permissions.Comment] },
                ];

                const permissionsResults = await Promise.all(permissionsToCheck.map(async ({ key, permissions }) => {
                    const result = await checkPermissions({ permissionsToCheck: permissions });
                    return { key, result };
                }));

                setPermissions(permissionsResults.reduce((acc, { key, result }) => ({ ...acc, [key]: result }), {}));
            } catch (error) {
                console.error('Failed to fetch user or permissions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const { data, mutate, isLoading } = useSWR(`/api/comments?postSlug=${postSlug}`, fetcher);

    const handleSubmit = async () => {
        // TODO: Validate the comment before sending
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                body: JSON.stringify({ desc, postSlug }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            mutate();
            setDesc("");
        } catch (error) {
            showToast.error(error.message);
        }
    };

    if (loading) return null;

    const { isMod, canEngage, canComment } = permissions;
    const isLoggedIn = status === "authenticated";

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Comments</h1>
            {canComment ? (
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
                isLoggedIn ? (
                    <p>You do not have permission to comment</p>
                ) : (
                    <Link href="/login">Login to write a comment</Link>
                )
            )}
            <div className={styles.comments}>
                {isLoading ? null : data?.map((item) => (
                    <Comment
                        hasModButtons={isMod}
                        hasEngagementButtons={canEngage}
                        mutate={mutate}
                        item={item}
                        key={item.id}
                        isLoggedIn={isLoggedIn}
                        isMod={isMod}
                        canEngage={canEngage}
                        user={user}
                    />
                ))}
            </div>
        </div>
    );
};

export default Comments;