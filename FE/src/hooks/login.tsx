import { useState } from "react";
import axios from "axios";
import { Backend_url } from "@/lib/config";

const useLogin = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setError] = useState<string | null>(null);

  const userLogin = async (data) => {
    console.log('login data recived is ');
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${Backend_url}/login`, data);
       
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { userLogin, message, loading, errors };
};

export default useLogin;
