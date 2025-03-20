import { useState } from "react";
import axios from "axios";

const useUpdateContest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateContestSolution = async (id: string, link: string) => {
    setIsLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:3001/api/contest/${id}`,
        { link },
      );

      if (response.status === 200) {
        setSuccess(true);
      } else {
        throw new Error("Failed to update contest");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateContestSolution, isLoading, success, error };
};

export default useUpdateContest;
