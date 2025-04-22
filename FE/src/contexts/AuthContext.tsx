import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { Backend_url } from "@/lib/config";

// Define the response type for login/admin login
interface AuthResponse {
  token: string;
  [key: string]: unknown; // For any other properties in the response
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;

  login: (email: string, password: string, name: string) => Promise<AxiosResponse<AuthResponse>>;

  adminLogin: (admin_name: string, password: string) => Promise<AxiosResponse<AuthResponse>>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Moving useAuth to a separate file
// Export context for use in the hook file
export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('contesto-token');
    const isAdmin = localStorage.getItem('contesto-isAdmin') === 'true';
    
    if (token) {
      try {
        // Verify token with backend
        const response = await axios.get(`${Backend_url}/api/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.status === 200) {
          setIsAuthenticated(true);
          setIsAdmin(isAdmin);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('contesto-token');
          localStorage.removeItem('contesto-isAdmin');
        }
      } catch (error) {
        console.error("Token verification error:", error);
        localStorage.removeItem('contesto-token');
        localStorage.removeItem('contesto-isAdmin');
      }
    }
  };

  const login = async (email: string, password: string, name: string): Promise<AxiosResponse<AuthResponse>> => {
    try {
      const response = await axios.post<AuthResponse>(`${Backend_url}/login`, { email, password, name });
      const { token } = response.data;
      
      localStorage.setItem('contesto-token', token);
      localStorage.setItem('contesto-isAdmin', 'false');
      setIsAuthenticated(true);
      setIsAdmin(false);
      navigate('/dashboard');
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const adminLogin = async (admin_name: string, password: string): Promise<AxiosResponse<AuthResponse>> => {
    try {
      const response = await axios.post<AuthResponse>(`${Backend_url}/admin_login`, { admin_name, password });
      const { token } = response.data;
      
      localStorage.setItem('contesto-token', token);
      localStorage.setItem('contesto-isAdmin', 'true');
      setIsAuthenticated(true);
      setIsAdmin(true);
      navigate('/admin');
      return response;
    } catch (error) {
      console.error("Admin login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('contesto-token');
    localStorage.removeItem('contesto-isAdmin');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAdmin, 
      login, 
      adminLogin, 
      logout, 
      checkAuthStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};