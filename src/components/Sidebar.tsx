import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { deleteLocalStorageData } from "../functions/functions";
import LogoutIcon from "@mui/icons-material/Logout";

interface SidebarProps {
  children?: React.ReactNode;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ children, setIsLogged }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  function Logout() {
    deleteLocalStorageData();
    setIsLogged(false);
  }

  return (
    <div
      className={[
        "flex flex-col h-full border-r bg-black border-black-200 transition-all duration-300",
        collapsed ? "w-12" : "w-56",
      ].join(" ")}
    >
      {/* Header Sidebar */}
      <div className="flex border-b justify-between border-gray-200">
        {collapsed ? (
          ""
        ) : (
          <div className="flex items-center gap-3 px-2 py-2">
            <img src={logo} alt="Studium logo" className="h-7 w-auto" />
            <span
              className="text-white text-xl font-light uppercase"
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
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center justify-center h-8 w-10 rounded-md self-center dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
          title={collapsed ? "Espandi" : "Comprimi"}
        >
          <span className="text-black-500 dark:text-gray-400 text-lg leading-none">
            {collapsed ? "›" : "‹"}
          </span>
        </button>
      </div>
      {/* Contenuto */}
      <div className="flex-1 overflow-hidden text-white font-bold">
        {!collapsed && children}
      </div>
      {!collapsed ? (
        <button
          className=" border-red-500 p-2 w-full bg-red-500 hover:cursor-pointer"
          onClick={Logout}
        >
          Logout
        </button>
      ) : (
        <div
          title="Logout"
          className="flex items-center justify-center h-8 w-full  bg-red-700 hover:bg-red-800"
        >
          <LogoutIcon onClick={Logout} />
        </div>
      )}
    </div>
  );
}
