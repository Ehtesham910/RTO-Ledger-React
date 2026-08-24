import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import PortalSidebar from "./PortalSidebar";

function PortalLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const token = sessionStorage.getItem("token");

  // Make sure only Customer role can access the portal layout
  if (!token || user.role !== "Customer") {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
      {isMobileOpen && (
        <div 
          className="sidebar-mobile-backdrop"
          onClick={closeMobileSidebar}
        />
      )}
      <PortalSidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileOpen}
        closeMobile={closeMobileSidebar}
        onExpand={() => setIsSidebarCollapsed(false)}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Navbar
          toggleSidebar={toggleSidebar}
          isCollapsed={isSidebarCollapsed}
        />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PortalLayout;
