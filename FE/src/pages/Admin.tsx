import { useState, useEffect } from "react";
import SolutionForm from "@/components/SolutionForm";
import { motion } from "framer-motion";
import { fetchAllContests } from "@/lib/api";
import { Contest } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import { useRecoilStateLoadable, useRecoilValue } from "recoil";
import { contestState, filterAtom } from "@/store/atoms/atom";

const Admin = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const data = useRecoilValue(contestState);
   
    
    
  // Fetch contests for the admin page (only completed ones)
  // const fetchContests = async () => {
    try {
      // setIsLoading(true);
      setError(null);

      // const allContests = await fetchAllContests();
      // Only completed contests are eligible for solutions
      const completedContests = data.filter((c) => c.status === "Finished");

      setContests(completedContests);
    } catch (error) {
      console.error("Error fetching contests:", error);
      setError("Failed to fetch contests. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch completed contests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  // };

  // useEffect(() => {
  //   fetchContests();
  // }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg text-foreground/70">
          Add solution links to completed contests
        </p>
      </motion.div>

      {error && (
        <motion.div
          className="p-4 mb-6 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>{error}</p>
          <button
            // onClick={fetchContests}
            className="mt-2 px-3 py-1 bg-red-200 dark:bg-red-800 rounded-full text-sm"
          >
            Try Again
          </button>
        </motion.div>
      )}

      <div className="mb-4 flex justify-end">
        <button
          // onClick={fetchContests}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Contests
        </button>
      </div>

      {isLoading ? (
        <div className="glass-card rounded-xl p-5 animate-pulse h-64" />
      ) : (
        <SolutionForm contests={contests} />
      )}
    </div>
  );
};

export default Admin;
