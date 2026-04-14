import { useState } from "react";
import logo from "../assets/logo.svg";

interface SidebarProps {
  children?: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={[
        "flex flex-col h-full border-r border-black-200 dark:border-gray-700 bg-black dark:bg-gray-900 transition-all duration-300",
        collapsed ? "w-12" : "w-56",
      ].join(" ")}
    >
      {/* Header Sidebar */}
      <div className="flex border-b border-gray-200">
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
    </div>
  );
}
