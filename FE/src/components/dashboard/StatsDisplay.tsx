import { motion } from "framer-motion";

interface StatsDisplayProps {
  stats: {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    platforms: {
      codeforces: number;
      codechef: number;
      leetcode: number;
    };
  };
  onResetFilters: () => void;
  showResetButton?: boolean;
}

const StatsDisplay = ({
  stats,
  onResetFilters,
  showResetButton = false,
}: StatsDisplayProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
      <div className="flex flex-wrap gap-3">
        <div className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
          Total: {stats.total}
        </div>

        <div className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Upcoming: {stats.upcoming}
        </div>

        <div className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Ongoing: {stats.ongoing}
        </div>

        <div className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
          Completed: {stats.completed}
        </div>
      </div>

      {showResetButton && stats.total === 0 && (
        <motion.button
          onClick={onResetFilters}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Reset Filters
        </motion.button>
      )}
    </div>
  );
};

export default StatsDisplay;
