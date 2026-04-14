import { useState } from "react";

interface SidebarProps {
  children?: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={[
        "flex flex-col h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300",
        collapsed ? "w-12" : "w-56",
      ].join(" ")}
    >
      {/* Bottone collassa */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-center h-10 w-full border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
        title={collapsed ? "Espandi" : "Comprimi"}
      >
        <span className="text-gray-500 dark:text-gray-400 text-lg leading-none">
          {collapsed ? "›" : "‹"}
        </span>
      </button>

      {/* Contenuto */}
      <div className="flex-1 overflow-hidden">{!collapsed && children}</div>
    </div>
  );
}
