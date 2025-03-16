import { Bookmark, RefreshCw } from "lucide-react";

interface BookmarkToggleProps {
  showOnlyBookmarked: boolean;
  isLoading: boolean;
  onToggleBookmark: () => void;
  onRefresh: () => void;
}

const BookmarkToggle = ({
  showOnlyBookmarked,
  isLoading,
  onToggleBookmark,
  onRefresh,
}: BookmarkToggleProps) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onToggleBookmark}
        className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full transition-colors ${
          showOnlyBookmarked
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        <Bookmark className="h-4 w-4" />
        {showOnlyBookmarked ? "Show All" : "Bookmarked Only"}
      </button>

      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        Refresh
      </button>
    </div>
  );
};

export default BookmarkToggle;
