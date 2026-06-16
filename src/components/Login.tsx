import { useState, type Dispatch, type SetStateAction } from "react";
import Logo from "./Logo";
import { BASE_URL } from "../functions/config";
import { writeLocalData } from "../storage/localData";

export default function LoginPage({
  isLogged,
}: {
  isLogged: Dispatch<SetStateAction<boolean>>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) {
      setError("Inserisci email e password.");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const r = await response.json();
      if (!r.result) {
        setError("Credenziali non valide.");
        return;
      }
      writeLocalData(r.data);
      isLogged(true);
    } catch {
      setError("Errore di connessione.");
    }
  }

  return (
    <div className="flex flex-col w-[30%] h-[55vh] items-center justify-center border border-divider rounded-md bg-base">
      <div className="flex items-center justify-center px-8 py-6 text-primary">
        <Logo className="h-12 w-auto" />
      </div>

      <div className="flex w-full h-full items-center justify-center rounded-md bg-surface text-primary">
        <div className="flex flex-col w-[75%]">
          <form onSubmit={handleSubmit}>
            <h3>Email</h3>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="email@studium.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none border mt-3 mb-3 border-gray-300 bg-gray-50 text-gray-900 transition focus:border-orange-500"
            />
            <h3>Password</h3>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none border  mt-3 mb-3 border-gray-300 bg-gray-50 text-gray-900 transition focus:border-orange-500"
            />
            {error && <p className="text-xs text-danger">{error}</p>}

            <button
              type="submit"
              className="mt-4 w-full py-2.5 text-sm font-bold text-white rounded-full bg-orange-600 hover:bg-orange-800 transition"
            >
              Accedi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
