type TextSkeletonProps = {
  colorClass: string; // Tailwind color class
  length: string; // Width of the skeleton (e.g., 'w-3/4', 'w-1/2')
};

const TextSkeleton: React.FC<TextSkeletonProps> = ({ colorClass, length }) => {
  return (
    <div className={`h-4 ${length} ${colorClass} rounded animate-pulse`} />
  );
};

export default TextSkeleton;
