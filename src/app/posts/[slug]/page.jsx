import Menu from "@/components/Menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "@/components/comments/Comments";
import { getBaseUrl } from "@/utils/config";
import MediaDisplay from "@/components/mediaDisplay/MediaDisplay";
import formatDate from "@/utils/formatDate";
import { FaThumbsUp, FaThumbsDown, FaClock, FaEye } from "react-icons/fa";
import readingTime from "reading-time";

const getData = async (slug) => {
  // This should be true if the current user has not visited the post in the past 30 minutes
  // The value is false if the user has visited the post in the past 30 minutes
  let shouldIncrementViews = true;

  const res = await fetch(`${getBaseUrl()}/api/posts/${slug}?incrementViews=${shouldIncrementViews}`, {
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const getDataMeta = async (slug) => {
  const res = await fetch(`${getBaseUrl()}/api/posts/${slug}/metadata`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const stripHtml = (input) => {
  let out = input;

  // Remove all html tags from input
  out = out.replace(/(<([^>]+)>)/gi, "");

  return out;
};

const formatDesc = (input) => {
  let out = input;

  // If the description is longer than 157 characters, truncate it and add ...
  if (out.length > 157) {
    out = out.substring(0, 157) + "...";
  }

  return out;
}

// Function to generate metadata based on post content
export async function generateMetadata({ params }) {
  const { slug } = params;
  const data = await getDataMeta(slug);

  const title = data?.metadata?.title || data?.title || "Default Title";
  const description = data?.metadata?.desc ? formatDesc(data.metadata.desc) : data?.desc ? formatDesc(stripHtml(data.desc)) : "Default Description";
  const images = data?.metadata?.image ? [{ url: data.metadata.image, alt: title }] : data?.img ? [{ url: data.img, alt: title }] : []

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    },
  };
}

const SinglePage = async ({ params }) => {
  const { slug } = params;
  const data = await getData(slug);

  // Temp vars for post info
  const likes = data?.likes || 0;
  const dislikes = data?.dislikes || 0;
  const views = data?.views || 0;

  // In order to check this post actually exists
  if (!data?.id) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Post not found</h1>
      </div>
    );
  }

  // Calculate reading time
  const readingTime_ = readingTime(stripHtml(data.desc));

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{data?.title}</h1>
          <div className={styles.user}>
            {data?.user?.image && (
              <div className={styles.userImageContainer}>
                <Image src={data.user.image} alt="" fill className={styles.avatar} />
              </div>
            )}
            <div className={styles.userTextContainer}>
              <span className={styles.username}>{data?.user?.name || data?.user?.email || "Anonymous"}</span>
              <span className={styles.date}>{formatDate(data.createdAt)}</span>
            </div>
          </div>
          <div>
            {/* Post information */}
            <div className={styles.postInfo}>
              {/* <span className={styles.postInfoItem}><FaThumbsUp /> {likes}</span> */}
              {/* <span className={styles.postInfoItem}><FaThumbsDown /> {dislikes}</span> */}
              <span className={styles.postInfoItem}><FaClock />{readingTime_.text}</span>
              {/* <span className={styles.postInfoItem}><FaEye /> {views}</span> */}
            </div>
          </div>
        </div>
        {data?.img && (
          <div className={styles.imageContainer}>
            <MediaDisplay src={data?.img} />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: data?.desc }}
          />
          <div className={styles.comment}>
            <Comments postSlug={slug} />
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default SinglePage;
