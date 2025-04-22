import SolutionForm from "@/components/SolutionForm";
import { useState, useEffect } from "react";
import LoadingSpinner from "./Loader";
import axios from "axios";
import { Backend_url } from "@/lib/config";

// Define the Contest type
type Contest = {
  id: string;
  name: string;
  platform: string;
  date: string;
  status: string;
  url: string;
};

export default function AdminPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  // Directly fetch only the finished contests from the backend
  useEffect(() => {
    const fetchFinishedContests = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${Backend_url}/api/filter`, { status: "Finished" });
        setContests(response.data.contests || []);
      } catch (error) {
        console.error("Error fetching finished contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinishedContests();
  }, []);

  return (
    <div className="min-h-screen w-full p-6 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-light tracking-tight mb-8 text-center">
          Contest Solutions
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="md" message="Loading contests..." />
          </div>
        ) : (
          // @ts-expect-error something is wrong with the type
          <SolutionForm contests={contests} />
        )}
      </div>
    </div>
  );
}
