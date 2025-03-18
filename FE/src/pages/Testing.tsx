import SolutionForm from "@/components/SolutionForm";
import { contestState } from "@/store/atoms/atom";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";

export default function Testing() {
  const data = useRecoilValue(contestState);
  console.log('data recived is ', data);
  
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    setLoading(true); // Start loading
    const completedContests = data.filter((c) => c.status === "Finished");
    console.log("All finished contests are:", completedContests.length);
    setContests(completedContests);
    setLoading(false); // Stop loading
  }, [data]);

  return (
    <div>
      <p>Hello</p>

      {loading ? (
        <div className="flex items-center justify-center">
          <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></span>
          <p className="ml-2">Loading...</p>
        </div>
      ) : (
        <SolutionForm contests={contests} />
      )}
    </div>
  );
}
