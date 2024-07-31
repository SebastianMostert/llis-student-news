import Image from 'next/image';
import React, { useState } from 'react';
import styles from './comment.module.css';
import formatDate from '@/utils/formatDate';
import { FaThumbsUp, FaThumbsDown, FaFlag, FaTrash } from 'react-icons/fa';
import Modal from '../modal/Modal';

const fetchRequest = async (url, method, body) => {
    const res = await fetch(url, {
        cache: "no-store",
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error(`Failed with status: ${res.status} | ${res.statusText}`);
    }

    return res.json();
};

const deleteComment = (commentId) => fetchRequest('/api/comments/', 'DELETE', { commentId });
const createEngagement = (commentId, like, dislike) => fetchRequest('/api/comments/engage', 'POST', { commentId, like, dislike });
const deleteEngagement = (id, like, dislike) => fetchRequest('/api/comments/engage', 'DELETE', { id, like, dislike });
const createReport = (commentId, reportOptions) => fetchRequest('/api/comments/report', 'POST', { commentId, reportOptions });

const Comment = ({
    hasModButtons,
    hasEngagementButtons,
    item,
    mutate,
    isLoggedIn,
    user,
    isMod,
    canEngage = false,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isAuthor = item.user.email === user?.email;
    const canDelete = isAuthor || isMod;
    const showDeleteButton = canDelete && hasModButtons;

    const disableEngagementButton = !isLoggedIn || !canEngage;
    const disableDeleteButton = !isLoggedIn || !canDelete;

    const { Like = [], Dislike = [] } = item;
    const hasLiked = Like.some((like) => like.userEmail === user?.email);
    const hasDisliked = Dislike.some((dislike) => dislike.userEmail === user?.email);

    const handleEngagement = async (type) => {
        const likeId = Like.find((like) => like.userEmail === user?.email)?.id;
        const dislikeId = Dislike.find((dislike) => dislike.userEmail === user?.email)?.id;

        try {
            if (type === 'like') {
                if (hasLiked) {
                    await deleteEngagement(likeId, true, false);
                } else {
                    if (hasDisliked) await deleteEngagement(dislikeId, false, true);
                    await createEngagement(item.id, true, false);
                }
            } else if (type === 'dislike') {
                if (hasDisliked) {
                    await deleteEngagement(dislikeId, false, true);
                } else {
                    if (hasLiked) await deleteEngagement(likeId, true, false);
                    await createEngagement(item.id, false, true);
                }
            }

            mutate();
        } catch (error) {
            console.error(`Failed to engage with comment: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteComment(item.id);
            mutate();
        } catch (error) {
            console.error('Failed to delete comment:', error.message);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const reportComment = async (options) => {
        try {
            await createReport(item.id, options);
            mutate();
        } catch (error) {
            console.error('Failed to report comment:', error.message);
        } finally {
            closeModal();
        }
    };

    return (
        <div className={styles.comment}>
            <div className={styles.user}>
                {item.user.image && (
                    <Image
                        src={item.user.image}
                        alt={`${item?.user?.name || item?.user?.email || "Anonymous"}'s profile`}
                        width={50}
                        height={50}
                        className={styles.image}
                    />
                )}
                <div className={styles.userInfo}>
                    <span className={styles.username}>{item?.user?.name || item?.user?.email || "Anonymous"}</span>
                    <span className={styles.date}>{formatDate(item.createdAt)}</span>
                </div>
            </div>
            <p className={styles.desc}>{item.desc}</p>

            {hasEngagementButtons && (
                <div className={styles.actions}>
                    <button
                        className={styles.button}
                        disabled={disableEngagementButton}
                        onClick={() => handleEngagement('like')}
                    >
                        <FaThumbsUp />
                        <span>{Like.length}</span>
                    </button>
                    <button
                        className={styles.button}
                        disabled={disableEngagementButton}
                        onClick={() => handleEngagement('dislike')}
                    >
                        <FaThumbsDown />
                        <span>{Dislike.length}</span>
                    </button>
                    <button
                        className={styles.button}
                        onClick={openModal}
                    >
                        <FaFlag />
                        <span>Report</span>
                    </button>
                </div>
            )}
            {showDeleteButton && (
                <div className={styles.modActions}>
                    <button
                        className={styles.modButton}
                        disabled={disableDeleteButton}
                        onClick={handleDelete}
                    >
                        <FaTrash />
                    </button>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                onReport={reportComment}
                comment={item}
            />
        </div>
    );
};

export default Comment;
