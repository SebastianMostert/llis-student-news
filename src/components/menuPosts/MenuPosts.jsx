import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./menuPosts.module.css"
import { getBaseUrl } from "@/utils/config";
import formatDate from "@/utils/formatDate";

const getData = async (fetchPopularPosts) => {
  const res = await fetch(`${getBaseUrl()}/api/posts?editorsPick=${!fetchPopularPosts}&popular=${fetchPopularPosts}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const getCatData = async () => {
  const res = await fetch(`${getBaseUrl()}/api/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};


const MenuPosts = async ({ withImage }) => {
  // If we are not including an image, we will fetch the posts based on popularity
  // Otherwise, we will fetch the posts based on editor's picks

  const { posts } = await getData(!withImage);
  const categories = await getCatData();

  const getCatColor = (catSlug) => {
    // Go through the categories array and find the one that matches the slug
    const cat = categories.find(category => category.slug === catSlug);
    return cat.hexColor;
  }

  return (
    <div className={styles.items}>
      {posts?.length > 0 ? posts.map(post => (
        <Link href={`/posts/${post.slug}`} className={styles.item} key={post._id}>
          {withImage &&
            post?.img && (
              <div className={styles.imageContainer}>
                <Image src={post.img} alt="" fill className={styles.image} />
              </div>
            )
          }
          <div className={styles.textContainer}>
            <span className={`${styles.category}`} style={{ backgroundColor: getCatColor(post.catSlug) }}>{post.catSlug}</span>
            <h3 className={styles.postTitle}>
              {post.title}
            </h3>
            <div className={styles.detail}>
              <span className={styles.username}>{post?.user?.name || post?.user?.email || "Anonymous"}</span>
              <span className={styles.date}> - {formatDate(post.createdAt)}</span>
            </div>
          </div>
        </Link>
      )) : <p>No posts found.</p>}
    </div>
  );
};

export default MenuPosts;