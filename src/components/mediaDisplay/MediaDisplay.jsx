import React from "react";
import styles from "./mediaDisplay.module.css";
import Image from "next/image";

const MediaDisplay = ({ src }) => {
  // Function to determine the type based on src
  const removeQueryParams = (url) => {
    return url.split("?")[0];
  }

  const getMediaType = (src) => {
    // Extract the file extension from the src URL
    const extension = removeQueryParams(src).split(".").pop().toLowerCase();

    // Define supported image and video file extensions
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const videoExtensions = ["mp4", "webm", "ogg"];

    // Check if the extension matches with image or video extensions
    if (imageExtensions.includes(extension)) {
      return "image";
    } else if (videoExtensions.includes(extension)) {
      return "video";
    } else {
      // If the extension is not recognized, assume it's an image (or handle as needed)
      return "image";
    }
  };

  // Determine the type of media
  const type = getMediaType(src);

  let mediaContent = null;

  if (type === "image") {
    // For images
    mediaContent = (
      <div className={styles.imageContainer}>
        <Image src={src} alt="" fill className={styles.image} />
      </div>
    );
  } else if (type === "video") {
    // For videos
    mediaContent = (
      <div className={styles.mediaWrapper}>
        <video controls className={styles.videoElement}>
          <source src={src} type="video/mp4" />
          {/* Add more <source> tags for different video formats if needed */}
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return <div className={styles.container}>{mediaContent}</div>;
};

export default MediaDisplay;
