import React, { createContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  age: number;
  surname: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    console.log("Kullanıcı giriş yaptı:", userData);
  };

  const logout = () => {
    setUser(null);
    console.log("Kullanıcı çıkış yaptı.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
