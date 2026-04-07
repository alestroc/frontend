// ─── 1. TIPI ────────────────────────────────────────────────────────────────

import { createContext, useContext, useState } from "react";

// Descrive la "forma" dei dati di autenticazione
interface AuthData {
  token: string;
  user: number;
  localid: string;
  name: string;
  sector: string;
  idpersonale: string;
}

// Descrive TUTTO ciò che il context espone ai componenti figli:
// dati + funzioni per modificarli

//se voglio utilizzare qualcosa tramite il context lo inserisco qui
interface AuthContextType {
  auth: AuthData | null;
  setAuth: (auth: AuthData | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

// ─── 2. CONTEXT ─────────────────────────────────────────────────────────────

// Crea il context. Il valore iniziale è null (prima che il Provider lo popoli).
// Il tipo generico <AuthContextType | null> dice a TypeScript cosa aspettarsi.
const AuthContext = createContext<AuthContextType | null>(null);

// ─── 3. PROVIDER ────────────────────────────────────────────────────────────

// È un normale componente React che:
// - contiene gli stati reali con useState
// - li passa a tutti i componenti figli tramite value={{...}}

// Poi creo lo stato qui e lo passo a value
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoggedIn, setIsLoggedIn }}>
      {children} {/* tutti i componenti dentro App hanno accesso */}
    </AuthContext.Provider>
  );
}

// ─── 4. HOOK ─────────────────────────────────────────────────────────────────

// Wrapper di useContext: semplifica l'import nei componenti
// e lancia un errore se usato fuori dal Provider (utile in sviluppo)
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
