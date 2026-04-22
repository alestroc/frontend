import React from "react";
import logo from "../assets/logo.svg";
import { deleteLocalStorageData } from "../functions/functions";
import LogoutIcon from "@mui/icons-material/Logout";

interface SidebarProps {
  children?: React.ReactNode;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  children,
  setIsLogged,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  function Logout() {
    deleteLocalStorageData();
    setIsLogged(false);
  }

  return (
    <div
      className={[
        "flex flex-col h-full border-r bg-slate-900 border-slate-700 transition-all duration-300",
        collapsed ? "w-12" : "w-56",
      ].join(" ")}
    >
      {/* Header Sidebar */}
      <div className="flex border-b border-slate-700 justify-between">
        {collapsed ? (
          ""
        ) : (
          <div className="flex items-center gap-3 px-2 py-2">
            <img src={logo} alt="Studium logo" className="h-7 w-auto" />
            <span
              className="text-slate-100 text-xl font-light uppercase tracking-widest"
              style={{
                fontFamily:
                  "'Futura', 'Century Gothic', 'Nunito Sans', sans-serif",
              }}
            >
              studium
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex items-center justify-center h-8 w-10 rounded-md self-center text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          title={collapsed ? "Espandi" : "Comprimi"}
        >
          <span className="text-lg leading-none">{collapsed ? "›" : "‹"}</span>
        </button>
      </div>
      {/* Contenuto */}
      <div className="flex-1 overflow-hidden text-slate-100 font-medium">
        {children}
      </div>
      {!collapsed ? (
        <button
          className="p-2 w-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          onClick={Logout}
        >
          Logout
        </button>
      ) : (
        <div
          title="Logout"
          className="flex items-center justify-center h-8 w-full bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
        >
          <LogoutIcon onClick={Logout} />
        </div>
      )}
    </div>
  );
}
