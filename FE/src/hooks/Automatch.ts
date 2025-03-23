import { useState } from "react";
import axios from "axios";
import { Backend_url } from "@/lib/config";

const useAutoMatch = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setError] = useState<string | null>(null);

  const fetchAutoMatch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${Backend_url}/api/matched`);
       
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
