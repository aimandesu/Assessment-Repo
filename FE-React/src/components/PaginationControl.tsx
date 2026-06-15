import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationControls = ({
  currentPage,
  lastPage,
  onGoTo,
}: {
  currentPage: number;
  lastPage: number;
  onGoTo: (p: number) => void;
}) => {
  if (lastPage <= 1) return null;

  const pages: (number | "…")[] = [];
  if (lastPage <= 7) {
    for (let i = 1; i <= lastPage; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("…");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(lastPage - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < lastPage - 2) pages.push("…");
    pages.push(lastPage);
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage === 1}
        onClick={() => onGoTo(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={14} />
      </Button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="px-1 text-sm text-muted-foreground select-none"
          >
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === currentPage ? "default" : "outline"}
            size="icon"
            className={cn(
              "h-8 w-8 text-sm",
              p === currentPage &&
                "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600",
            )}
            onClick={() => onGoTo(p as number)}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage === lastPage}
        onClick={() => onGoTo(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={14} />
      </Button>
    </div>
  );
};

export default PaginationControls;
