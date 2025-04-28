
import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import { User, AuthState } from "../types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check for existing user session in local storage
    const storedUser = localStorage.getItem("cryptoArenaUser");
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } catch (error) {
        localStorage.removeItem("cryptoArenaUser");
        setState({
          ...initialState,
          loading: false,
        });
      }
    } else {
      setState({
        ...initialState,
        loading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState({ ...state, loading: true });
      
      // Mock API call - this would be a real fetch in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: "user-1",
        username: email.split("@")[0],
        email,
        points: 1000,
        isAdmin: email === "admin@example.com",
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem("cryptoArenaUser", JSON.stringify(mockUser));
      
      setState({
        user: mockUser,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      
      toast.success("Login successful!");
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: "Invalid credentials",
      });
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setState({ ...state, loading: true });
      
      // Mock API call - this would be a real fetch in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: `user-${Math.floor(Math.random() * 10000)}`,
        username,
        email,
        points: 500, // Initial points for new users
        isAdmin: false,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem("cryptoArenaUser", JSON.stringify(mockUser));
      
      setState({
        user: mockUser,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      
      toast.success("Registration successful! Welcome to CryptoArena League!");
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: "Registration failed",
      });
      toast.error("Registration failed. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("cryptoArenaUser");
    setState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
