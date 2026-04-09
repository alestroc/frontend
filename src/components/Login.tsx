// import { useState } from "react";
// import logo from "../assets/logo.svg";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState("");

//   function handleSubmit() {
//     if (!email || !password) {
//       setError("Inserisci email e password.");
//       return;
//     }
//     setError("");
//     // TODO: chiamata API di autenticazione
//     console.log("Login con", email, "| salva login:", rememberMe);
//   }

//   return (
//     <div
//       className="min-h-screen w-100 flex items-center justify-center px-4 py-10"
//       style={{
//         fontFamily: "'Nunito Sans', sans-serif",
//       }}
//     >
//       <div
//         className="w-full max-w-sm rounded-2xl overflow-hidden"
//         style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
//       >
//         {/* Brand header */}
//         <div
//           className="flex items-center gap-3 px-8 py-6"
//           style={{ backgroundColor: "#2c3338" }}
//         >
//           <img src={logo} alt="Studium logo" className="h-9 w-auto" />
//           <span
//             className="text-white text-2xl font-light tracking-[0.22em] uppercase"
//             style={{
//               fontFamily:
//                 "'Futura', 'Century Gothic', 'Nunito Sans', sans-serif",
//             }}
//           >
//             studium
//           </span>
//         </div>

//         {/* Form area */}
//         <div className="bg-white px-8 py-8">
//           <h2 className="text-xl font-bold mb-1" style={{ color: "#2c3338" }}>
//             Accedi
//           </h2>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleSubmit();
//             }}
//             noValidate
//             className="flex flex-col gap-4"
//           >
//             <div className="flex flex-col gap-1.5">
//               <label
//                 htmlFor="email"
//                 className="text-sm font-semibold"
//                 style={{ color: "#374151" }}
//               >
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 placeholder="nome@azienda.it"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition"
//                 style={{
//                   border: "1.5px solid #d1d5db",
//                   backgroundColor: "#fafafa",
//                   color: "#111827",
//                 }}
//                 onFocus={(e) => (e.currentTarget.style.borderColor = "#fa5708")}
//                 onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label
//                 htmlFor="password"
//                 className="text-sm font-semibold"
//                 style={{ color: "#374151" }}
//               >
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 autoComplete="current-password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition"
//                 style={{
//                   border: "1.5px solid #d1d5db",
//                   backgroundColor: "#fafafa",
//                   color: "#111827",
//                 }}
//                 onFocus={(e) => (e.currentTarget.style.borderColor = "#fa5708")}
//                 onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
//               />
//             </div>

//             {error && (
//               <p className="text-xs" style={{ color: "#dc2626" }}>
//                 {error}
//               </p>
//             )}

//             <label className="flex items-center gap-2 cursor-pointer select-none">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//                 className="h-4 w-4 rounded cursor-pointer"
//                 style={{ accentColor: "#fa5708" }}
//               />
//               <span className="text-sm" style={{ color: "#6b7280" }}>
//                 Salva login
//               </span>
//             </label>

//             <button
//               type="submit"
//               className="mt-1 w-full py-2.5 text-sm font-bold text-white transition rounded-full"
//               style={{ backgroundColor: "#fa5708" }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.backgroundColor = "#e04e06")
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.backgroundColor = "#fa5708")
//               }
//             >
//               Accedi
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import logo from "../assets/logo.svg";
import axios from "axios";

export default function LoginPage({ isLogged }: { isLogged: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [email, setEmail] = useState("testts@studium.it");
  const [password, setPassword] = useState("Studium2026!");
  const [error, setError] = useState("");
  const [saveLogin, setSaveLogin] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Inserisci email e password.");
      return;
    }
    axios
      .post("http://studium.backend/api/login", { email, password })
      .then((response) => {
        const r = response.data;
        if (!r.result) {
          setError("Credenziali non valide.");
          return;
        }
        // console.log(typeof r.data);
        localStorage.setItem("dati", JSON.stringify(r.data));
        isLogged(true);
      })
      .catch(() => setError("Errore di connessione."));
  }
  return (
    <>
      <div className="flex flex-col w-[30%] h-[50%] items-center justify-center align-center border rounded-md color-[2c3338]">
        <div className="flex items-center gap-3 px-8 py-6 overflow-hidden">
          <img src={logo} alt="Studium logo" className="h-9 w-auto" />
          <span
            className="text-white text-2xl font-light tracking-[0.22em] uppercase"
            style={{
              fontFamily:
                "'Futura', 'Century Gothic', 'Nunito Sans', sans-serif",
            }}
          >
            studium
          </span>
        </div>
        <div className="flex w-[100%] h-[800%]  place-items-center justify-center rounded-md bg-[#272b3f]">
          <form
            className=""
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div className="flex flex-col gap-2">
              <h3>Email</h3>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="email@dominio.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition"
                style={{
                  border: "1.5px solid #d1d5db",
                  backgroundColor: "#fafafa",
                  color: "#111827",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#fa5708")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
              />
              <h3>Password</h3>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition"
                style={{
                  border: "1.5px solid #d1d5db",
                  backgroundColor: "#fafafa",
                  color: "#111827",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#fa5708")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
              />
              {error && (
                <p className="text-xs color-[" style={{ color: "#dc2626" }}>
                  {error}
                </p>
              )}
              <div>
                <input
                  type="checkbox"
                  checked={saveLogin}
                  onChange={(e) => setSaveLogin(e.target.checked)}
                  className="h-4 w-4 rounded cursor-pointer"
                  style={{ accentColor: "#fa5708" }}
                />
                <span
                  className="text-sm p-2 text-center align-top"
                  style={{ color: "#6b7280" }}
                >
                  Salva login
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-1 w-full py-2.5 text-sm font-bold text-white transition rounded-full"
              style={{ backgroundColor: "#fa5708" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e04e06")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fa5708")
              }
            >
              Accedi
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
