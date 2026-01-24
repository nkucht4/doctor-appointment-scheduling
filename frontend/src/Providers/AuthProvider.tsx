import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};


export const AuthContext = createContext<AuthContextType | null>(null);


const storageFactory = (mode: string): Storage | null => {
  if (mode === "local") return localStorage;
  if (mode === "session") return sessionStorage;
  return null; 
};


export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [storage, setStorage] = useState<Storage | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);


  useEffect(() => {
    const initAuth = async () => {
      const res = await fetch("http://localhost:8080/auth_settings");
      const data = await res.json();

      const selectedStorage = storageFactory(data.persistenceMode);
      setStorage(selectedStorage);

      const savedToken = selectedStorage?.getItem("token") || null;
      const savedUser = selectedStorage?.getItem("user");

      setToken(savedToken);
      setUser(savedUser ? JSON.parse(savedUser) : null);
      setInitialized(true);
    };

    initAuth();
  }, []);

  
  const login = (accessToken: string, user: User) => {
    if (storage) {
      storage.setItem("token", accessToken);
      storage.setItem("user", JSON.stringify(user));
    }

    setToken(accessToken);
    setUser(user);
  };


  const logout = () => {
    storage?.removeItem("token");
    storage?.removeItem("user");

    setToken(null);
    setUser(null);
  };



  if (!initialized) return null; 

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
