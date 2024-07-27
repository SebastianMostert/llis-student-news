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

export async function generateMetadata({ params }, parent) {
  // read route params
  const { slug } = params;

  // fetch data
  const data = await getData(slug)

  // optionally access and extend (rather than replace) parent metadata
  const images = [data?.img] || []

  const desc = data.desc;

  // Remove HTML tags from the description
  let cleanDesc = desc.replace(/(<([^>]+)>)/gi, "");
  cleanDesc = cleanDesc.substring(0, 60) + "...";

  return {
    title: data.title,
    description: cleanDesc,
    openGraph: {
      images,
    },
  }
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
