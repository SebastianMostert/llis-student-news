import Menu from "@/components/Menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "@/components/comments/Comments";
import { getBaseUrl } from "@/utils/config";
import MediaDisplay from "@/components/mediaDisplay/MediaDisplay";
import formatDate from "@/utils/formatDate";

const getData = async (slug) => {
  const res = await fetch(`${getBaseUrl()}/api/posts/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

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
  const data = await getData(slug);

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
              <span className={styles.username}>{data?.user?.name}</span>
              <span className={styles.date}>{formatDate(data.createdAt)}</span>
            </div>
          </div>
        </div>
        {data?.img && (
          <div className={styles.imageContainer}>
            <MediaDisplay src={data?.img} />
            {/* <Image src={data.img} alt="" fill className={styles.image} /> */}
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
