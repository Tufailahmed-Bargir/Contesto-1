// import { contestState } from "@/store/atoms/data"
// import { useRecoilValue } from "recoil"

// export default function Page() {
//     const data = useRecoilValue(contestState)

//     if (!data || data.length === 0) {
//         return <div className="mt-20 text-center">No contests available</div>;
//     }

//     return (
//         <div className="mt-20 px-4">
//             <h1 className="text-center text-2xl font-semibold mb-6">Upcoming Contests</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {data.map((contest, index) => (
//                     <Card key={index} contest={contest} />
//                 ))}
//             </div>
//         </div>
//     );
// }

// type ContestProp = {
//     platform: string;
//     name: string;
//     status: string;
//     date: string;
//     time: string;
//     relativeTime: string;
//     url: string;
// };

// function Card({ contest }: { contest: ContestProp }) {
//     return (
//         <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
//             <div className="flex justify-between items-center">
//                 <span className="text-gray-500 text-sm">{contest.platform}</span>
//                 <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-lg">
//                     {contest.status}
//                 </span>
//             </div>

//             <h2 className="text-lg font-semibold text-gray-900">{contest.name}</h2>

//             <div className="text-gray-500 text-sm">📅 {contest.date}</div>
//             <div className="text-gray-500 text-sm">⏰ {contest.time}</div>
//             <div className="text-blue-600 text-sm font-medium">{contest.relativeTime}</div>

//             <a
//                 href={contest.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 text-sm font-medium flex items-center hover:underline"
//             >
//                 Visit Contest 🔗
//             </a>
//         </div>
//     );
// }

// import { contestState } from "@/store/atoms/data";
import { useRecoilValue } from "recoil";
import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  Clock,
  ExternalLink,
  Youtube,
} from "lucide-react";
import { useState, useEffect } from "react";
import { contestState } from "@/store/atoms/atom";

export default function Page() {
  const data = useRecoilValue(contestState);

  if (!data || data.length === 0) {
    return <div className="mt-20 text-center">No contests available</div>;
  }

  return (
    <div className="mt-20 px-4">
      <h1 className="text-center text-2xl font-semibold mb-6">
        Upcoming Contests
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((contest, index) => (
          <Card key={contest.id} contest={contest} index={index} />
        ))}
      </div>
    </div>
  );
}

type ContestProp = {
  id: string;
  platform: string;
  name: string;
  status: "upcoming" | "ongoing" | "completed";
  date: string;
  time: string;
  relativeTime: string;
  url: string;
  solutionUrl?: string; // YouTube solution link
};

export function Card({
  contest,
  index,
}: {
  contest: ContestProp;
  index: number;
}) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const storedBookmarks = JSON.parse(
      localStorage.getItem("bookmarkedContests") || "[]",
    );
    setBookmarked(storedBookmarks.includes(contest.id));
  }, [contest.id]);

  const toggleBookmark = () => {
    let storedBookmarks = JSON.parse(
      localStorage.getItem("bookmarkedContests") || "[]",
    );

    if (bookmarked) {
      storedBookmarks = storedBookmarks.filter(
        (id: string) => id !== contest.id,
      );
    } else {
      storedBookmarks.push(contest.id);
    }

    localStorage.setItem("bookmarkedContests", JSON.stringify(storedBookmarks));
    setBookmarked(!bookmarked);
  };

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    ongoing: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-2xl p-6 space-y-4 transition-all hover:shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-start">
        <span className="text-gray-500 text-sm">{contest.platform}</span>

        <div className="flex items-center space-x-2">
          <span
            className={`text-xs px-2 py-1 rounded-lg ${statusColors[contest.status]}`}
          >
            {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
          </span>

          {/* <motion.button
                        onClick={toggleBookmark}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                        whileTap={{ scale: 0.9 }}
                    >
                        {bookmarked ? (
                            <BookmarkCheck className="h-5 w-5 text-yellow-500" />
                        ) : (
                            <Bookmark className="h-5 w-5" />
                        )}
                    </motion.button> */}
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900">{contest.name}</h2>

      <div className="text-gray-500 text-sm flex items-center">
        <Calendar className="h-4 w-4 mr-2" /> {contest.date}
      </div>

      <div className="text-gray-500 text-sm flex items-center">
        <Clock className="h-4 w-4 mr-2" /> {contest.time}
      </div>

      {contest.status === "upcoming" && (
        <div className="text-blue-600 text-sm font-medium">
          Starts {contest.relativeTime}
        </div>
      )}

      <a
        href={contest.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 text-sm font-medium flex items-center hover:underline"
      >
        Visit Contest <ExternalLink className="h-4 w-4 ml-1" />
      </a>

      {contest.solutionUrl && (
        <a
          href={contest.solutionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-red-600 dark:text-red-400 flex items-center hover:underline"
        >
          Solution <Youtube className="h-3 w-3 ml-1" />
        </a>
      )}
    </motion.div>
  );
}
