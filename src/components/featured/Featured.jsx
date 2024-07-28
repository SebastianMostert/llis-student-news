import React from 'react'
import styles from './featured.module.css'
import Image from 'next/image'
import { getBaseUrl } from '@/utils/config';
import Link from 'next/link';
import descToHtml from '@/utils/descToHtml';
import { titleText } from '@/utils/constant';

const getData = async () => {
    const res = await fetch(`${getBaseUrl()}/api/posts?featured=true`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
};

const Featured = async () => {
    const { posts } = await getData();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                {titleText}
            </h1>
            {posts?.map(post => (
                <div className={styles.post} key={post._id}>
                    {post?.img && (
                        <div className={styles.imgContainer}>
                            <Image src={post.img} alt="" fill className={styles.image} />
                        </div>
                    )}
                    <div className={styles.textContainer}>
                        <h1 className={styles.postTitle}>{post.title}</h1>
                        <div
                            className={styles.desc}
                            dangerouslySetInnerHTML={{
                                __html: descToHtml(post.desc),
                            }}
                        />
                        <Link href={`/posts/${post.slug}`}>
                            <button className={styles.button}>Read More</button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Featured