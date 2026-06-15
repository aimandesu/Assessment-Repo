import React from "react";

const SkeletonRow = ({ rowsCount }: { rowsCount: number }) => {
  return (
    <div className="flex w-full gap-4 py-2">
      {[...Array(rowsCount)].map((_, i) => (
        <div key={i} className="h-4 flex-1 rounded bg-muted animate-pulse" />
      ))}
    </div>
  );
};

export default SkeletonRow;
