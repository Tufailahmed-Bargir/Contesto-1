import { useState, useEffect } from "react";
import axios from "axios";
import { Backend_url } from "@/lib/config";

type Contest = {
  id: string;
  name: string;
  platform: string;
  date: string;
  status: string;
  url: string;
}; // Adjust based on actual structure of contests

export const useFetchAll = () => {
  const [contests, setContests] = useState<Contest[] | null>(null); // Updated type
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${Backend_url}/api/all`);
        console.log("Data received:", response.data);

        // Assuming `response.data.contests` is an array
        setContests(response.data.contests);
      } catch (err: any) {
        console.error("Error fetching contests:", err);
        setError(err?.response?.data?.message || "An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll(); // Automatically fetch data on component mount
  }, []); // Empty dependency array ensures this runs only once on mount

  return { contests, loading, errors };
};

 


 

 
 

const useFetchFilter = (filterKey: string) => {
  const [filteredContests, setFilteredContests] = useState<Contest[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilteredContests = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parse filter parameters from the JSON key
        const filterData = JSON.parse(filterKey);

        const response = await axios.post(`${Backend_url}/api/filter`, filterData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Filtered contests received:", response.data);
        setFilteredContests(response.data.contests);
      } catch (err: any) {
        console.error("Error fetching filtered contests:", err);
        setError(err?.response?.data?.message || "An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Trigger fetch when `filterKey` changes
    if (filterKey) {
      console.log("Filter data being sent:", JSON.parse(filterKey));
      fetchFilteredContests();
    }
  }, [filterKey]); // Re-run when `filterKey` changes

  return { filteredContests, loading, errors };
};

export default useFetchFilter;


 
