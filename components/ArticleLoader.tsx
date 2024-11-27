import React from 'react';
import TextSkeleton from './TextSkeleton';

// Helper function to generate random widths
const getRandomWidth = () => {
  const widths = ['w-[95%]', 'w-[90%]', 'w-[85%]', 'w-[80%]', 'w-[75%]', 'w-[70%]'];
  return widths[Math.floor(Math.random() * widths.length)];
};

const SkeletonArticle = () => {
  return (
    <article className="bg-secondaryBg-light dark:bg-secondaryBg-dark flex flex-col rounded-lg shadow-lg animate-pulse">
      {/* Image Placeholder */}
      <div className="h-56 w-full bg-primaryBg-light/60 dark:bg-primaryBg-dark/50 rounded-t-lg"></div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col p-5">
          {/* Title Placeholder */}
          <TextSkeleton colorClass="bg-primaryBg-light/80 dark:bg-primaryBg-dark/70" length={getRandomWidth()} />

          {/* Content Placeholders */}
          <div className="space-y-2 mt-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <TextSkeleton
                key={index}
                colorClass="bg-primaryBg-light/70 dark:bg-primaryBg-dark/60"
                length={getRandomWidth()}
              />
            ))}
          </div>

          {/* Footer Placeholder */}
          <footer className="flex space-x-2 pt-5">
            <TextSkeleton colorClass="bg-primaryBg-light/60 dark:bg-primaryBg-dark/50" length="w-[30%]" />
            <TextSkeleton colorClass="bg-primaryBg-light/60 dark:bg-primaryBg-dark/50" length="w-[20%]" />
          </footer>
        </div>

        {/* Read More Button Placeholder */}
        <div className="h-10 w-full bg-accent-light/80 dark:bg-accent-dark/70 rounded-b-lg mt-2"></div>
      </div>
    </article>
  );
};

export default SkeletonArticle;
