import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LoginPage from "./Login";
import Dashboard from "./Dashboard";

export default function AppContent() {
  const { isLoggedIn, auth } = useAuth();

  useEffect(() => {
    console.log("auth aggiornato:", auth);
  }, [auth]);

  return <>{isLoggedIn ? <Dashboard /> : <LoginPage />}</>;
}
