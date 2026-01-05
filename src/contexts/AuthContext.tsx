import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
  hasCompletedActivity: boolean;
  setActivityCompleted: () => void;
  resetActivityStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedActivity, setHasCompletedActivity] = useState(false);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }

    // Check if activity has been completed today
    const activityDate = localStorage.getItem("activity_completed_date");
    const today = new Date().toDateString();
    if (activityDate === today) {
      setHasCompletedActivity(true);
    } else {
      setHasCompletedActivity(false);
    }

    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Reset activity status on new login
    setHasCompletedActivity(false);
    localStorage.removeItem("activity_completed_date");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setHasCompletedActivity(false);
    localStorage.removeItem("activity_completed_date");
  };

  const setActivityCompleted = () => {
    setHasCompletedActivity(true);
    localStorage.setItem("activity_completed_date", new Date().toDateString());
  };

  const resetActivityStatus = () => {
    setHasCompletedActivity(false);
    localStorage.removeItem("activity_completed_date");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      hasCompletedActivity,
      setActivityCompleted,
      resetActivityStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
