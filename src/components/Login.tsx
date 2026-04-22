import { useState, type Dispatch, type SetStateAction } from "react";
import logo from "../assets/logo.svg";
import { BASE_URL } from "../functions/config";

export default function LoginPage({
  isLogged,
}: {
  isLogged: Dispatch<SetStateAction<boolean>>;
}) {
  const [email, setEmail] = useState("testts@studium.it");
  const [password, setPassword] = useState("Studium2026!");
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
      localStorage.setItem("dati", JSON.stringify(r.data));
      isLogged(true);
    } catch {
      setError("Errore di connessione.");
    }
  }

  return (
    <div className="flex flex-col w-[30%] h-[50%] items-center justify-center border rounded-md">
      <div className="flex items-center gap-3 px-8 py-6">
        <img src={logo} alt="Studium logo" className="h-9 w-auto" />
        <span
          className="text-white text-2xl font-light tracking-[0.22em] uppercase"
          style={{
            fontFamily: "'Futura', 'Century Gothic', 'Nunito Sans', sans-serif",
          }}
        >
          studium
        </span>
      </div>

      <div className="flex w-full h-full items-center justify-center rounded-md bg-[#272b3f]">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <h3>Email</h3>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="email@dominio.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none border border-gray-300 bg-gray-50 text-gray-900 transition focus:border-orange-500"
            />
            <h3>Password</h3>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none border border-gray-300 bg-gray-50 text-gray-900 transition focus:border-orange-500"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-2.5 text-sm font-bold text-white rounded-full bg-orange-600 hover:bg-orange-800 transition"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}
