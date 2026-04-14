import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../utils/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "habit_tracker_token";

function parseToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Check if the token has expired
    if (payload.exp * 1000 < Date.now()) {
      return null;
    }

    return { id: payload.userId };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedToken) {
      const parsed = parseToken(storedToken);

      if (parsed) {
        setToken(storedToken);
        setUser(parsed);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  function saveSession(tokenValue, userData) {
    localStorage.setItem(TOKEN_KEY, tokenValue);
    setToken(tokenValue);
    setUser(userData);
  }

  async function signup(name, email, password) {
    const data = await apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    saveSession(data.token, data.user);
    return data;
  }

  async function signin(email, password) {
    const data = await apiRequest("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    saveSession(data.token, data.user);
    return data;
  }

  function signout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  const value = { user, token, isLoading, signup, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
