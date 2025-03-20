// import SolutionForm from "@/components/SolutionForm";
// import { contestState } from "@/store/atoms/atom";
// import { useState, useEffect } from "react";
// import { useRecoilValue } from "recoil";

// export default function Testing() {
//   const data = useRecoilValue(contestState);
//   console.log('data recived is ', data);

//   const [contests, setContests] = useState([]);
//   const [loading, setLoading] = useState(true); // Loader state

//   useEffect(() => {
//     setLoading(true); // Start loading
//     const completedContests = data.filter((c) => c.status === "Finished");
//     console.log("All finished contests are:", completedContests.length);
//     setContests(completedContests);
//     setLoading(false); // Stop loading
//   }, [data]);

//   return (
//     <div>
//       <p>Hello</p>

//       {loading ? (
//         <div className="flex items-center justify-center">
//           <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></span>
//           <p className="ml-2">Loading...</p>
//         </div>
//       ) : (
//         <SolutionForm contests={contests} />
//       )}
//     </div>
//   );
// }

import SolutionForm from "@/components/SolutionForm";
import { contestState } from "@/store/atoms/atom";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "./Loader";
// import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Testing() {
  const data = useRecoilValue(contestState);
  console.log("data received is ", data);

  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      const completedContests = data.filter((c) => c.status === "Finished");
      console.log("All finished contests are:", completedContests.length);
      setContests(completedContests);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [data]);

  return (
    <motion.div
      className="min-h-screen w-full p-6 md:p-8 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h1
          className="text-4xl font-light tracking-tight mb-8 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Contest Solutions
        </motion.h1>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center py-20"
            >
              <LoadingSpinner size="md" message="Loading contests..." />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SolutionForm contests={contests} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
