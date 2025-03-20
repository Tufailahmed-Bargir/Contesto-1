import { useState } from "react";
import axios from "axios";

const useAutoMatch = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setError] = useState<string | null>(null);

  const fetchAutoMatch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("http://localhost:3001/api/automatch");
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { fetchAutoMatch, message, loading, errors };
};

export default useAutoMatch;
