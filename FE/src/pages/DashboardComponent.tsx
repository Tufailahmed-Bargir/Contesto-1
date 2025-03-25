import {
  Search,
  SlidersHorizontal,
  X,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ContestCard } from "@/components/ui/ContestCard";
import { Contest } from "@/lib/types";
import Loader from "@/components/ui/Loader";
import useFetchFilter from "@/hooks/all";

const platforms = [
  { id: "codeforces", name: "Codeforces", color: "bg-codeforces", icon: "CF" },
  { id: "codechef", name: "CodeChef", color: "bg-codechef", icon: "CC" },
  { id: "leetcode", name: "LeetCode", color: "bg-leetcode", icon: "LC" },
];

const filterOptions = [
  { value: "all", label: "All Contests" },
  { value: "Upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "Finished", label: "Finished" },
];

export default function Dashboard() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const toggleBookmark = (contestId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(contestId)
        ? prev.filter((id) => id !== contestId)
        : [...prev, contestId]
    );
  };

  const filterParams = {
    platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    search: searchQuery || undefined,
  };

  const filterKey = JSON.stringify(filterParams);
  const { filteredContests, loading, errors } = useFetchFilter(filterKey);

  if (loading) {
    return <Loader />;
  }

  const displayedContests =
    filteredContests && filteredContests.length > 0
      ? showBookmarksOnly
        ? filteredContests.filter((contest) =>
            bookmarkedIds.includes(contest.id)
          )
        : filteredContests
      : [];

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search contests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-input hover:bg-accent transition-colors duration-200"
            whileTap={{ scale: 0.97 }}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {showFilters ? "▲" : "▼"}
          </motion.button>

          <motion.button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-colors duration-200 ${
              showBookmarksOnly
                ? "bg-primary text-white"
                : "border-input hover:bg-accent"
            }`}
            whileTap={{ scale: 0.97 }}
          >
            <Bookmark className="h-4 w-4" />
            {showBookmarksOnly ? "Show All" : "Show Bookmarks"}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 glass-card rounded-xl space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedStatus(option.value)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                        selectedStatus === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.name)}
                      className={`flex items-center gap-2 px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${
                        selectedPlatforms.includes(platform.name)
                          ? `text-white ${platform.color}`
                          : "text-foreground/70 bg-background hover:bg-secondary/50"
                      }`}
                    >
                      <span className="font-medium">{platform.icon}</span>
                      {platform.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedContests.length > 0 ? (
          displayedContests.map((contest, index) => (
            <div key={contest.id} className="relative">
              {/* @ts-expect-error some */}
              <ContestCard contest={contest} index={index} />
              <motion.button
                onClick={() => toggleBookmark(contest.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-yellow-500 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                {bookmarkedIds.includes(contest.id) ? (
                  <BookmarkCheck className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">
            {showBookmarksOnly
              ? "No bookmarked contests."
              : "No contests found."}
          </p>
        )}
      </div>
    </div>
  );
}
