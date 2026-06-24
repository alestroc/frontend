import React from "react";
import { deleteLocalStorageData } from "../functions/functions";
import LogoutIcon from "@mui/icons-material/Logout";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Logo from "./Logo";

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
        "flex flex-col h-full border-r bg-surface border-divider transition-all duration-300",
        collapsed ? "w-12" : "w-56",
      ].join(" ")}
    >
      {/* Header Sidebar */}
      <div className="flex border-b border-divider justify-between">
        {collapsed ? (
          ""
        ) : (
          <div className="flex items-center px-4 py-2 text-primary">
            <Logo className="h-9 w-auto" />
          </div>
        )}

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex items-center justify-center h-14 w-12  self-center text-muted hover:bg-base hover:text-primary transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
          title={collapsed ? "Espandi" : "Comprimi"}
        >
          <span className="text-lg leading-none">
            {collapsed ? <ChevronRight /> : <ChevronLeft fontSize="small" />}
          </span>
        </button>
      </div>
      {/* Contenuto */}
      <div className="flex-1 overflow-hidden text-primary font-medium">
        {children}
      </div>
      {!collapsed ? (
        <button
          className="p-2 w-full bg-danger-strong text-white font-medium hover:bg-danger transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-base"
          onClick={Logout}
        >
          Logout
        </button>
      ) : (
        <div
          title="Logout"
          className="flex items-center justify-center h-8 w-full bg-danger-strong text-white hover:bg-danger transition-colors cursor-pointer"
        >
          <LogoutIcon onClick={Logout} />
        </div>
      )}
    </div>
  );
}
