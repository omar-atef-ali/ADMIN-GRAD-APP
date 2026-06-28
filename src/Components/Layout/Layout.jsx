import React, { useEffect, useState, useContext } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import styles from "./Layout.module.css";
import api from "../../api";
import { userContext } from "../../context/userContext";

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const { setUserToken } = useContext(userContext);
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);

    if (segments.length === 0) {
      return "Dashboard";
    }

    return segments
      .map((segment) => {
        // Check if segment is an ID (e.g. MongoDB ID, number, or long token)
        const isId = /^[0-9a-fA-F]{24}$/.test(segment) || !isNaN(segment) || segment.length > 20;
        if (isId) return "Details";

        // Capitalize and format word (e.g., "my-permissions" -> "My Permissions")
        return segment
          .split(/[-_]/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      })
      .join(" / ");
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUserToken(null)
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("id")
    localStorage.removeItem("email")
    navigate("/");
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "fa-solid fa-gauge-high" },
    { path: "clients", label: "Clients", icon: "fa-solid fa-users" },
    { path: "users", label: "Users", icon: "fa-solid fa-user-shield" },
    { path: "roles", label: "Roles", icon: "fa-solid fa-user-gear" },
    { path: "packages", label: "Packages", icon: "fa-solid fa-cubes" },
    { path: "services", label: "Services", icon: "fa-solid fa-box" },
    { path: "orders", label: "Orders", icon: "fa-solid fa-bag-shopping" },
    { path: "my-permissions", label: "My Permissions", icon: "fa-solid fa-lock" },
    { path: "settings", label: "Settings", icon: "fa-solid fa-sliders" },

  ];

  async function userInfo() {
    try {
      const { data } = await api.get('/Accounts')
      setAdminInfo(data)
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    userInfo()
  }, []);

  return (
    <div className={styles.layoutContainer}>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidenavbar (Left) */}
      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""} ${isMobileOpen ? styles.mobileOpen : ""
          }`}
      >
        {/* Brand Header */}
        <div onClick={() => navigate("/dashboard")} className={styles.brand}>

          <span className={styles.brandName}>Namaa</span>

          {/* Close button for Mobile */}
          <button
            className={styles.closeBtn}
            onClick={() => setIsMobileOpen(false)}
            title="Close Menu"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `${styles.menuItem} ${isActive ? styles.active : ""}`
              }
              title={isCollapsed ? item.label : ""}
              onClick={() => setIsMobileOpen(false)}
            >
              <div className={styles.menuIconContainer}>
                <i className={`${item.icon} ${styles.menuIcon}`}></i>
              </div>
              <span className={styles.menuLabel}>{item.label}</span>
              {item.badge && (
                <span className={`${styles.badge} ${isCollapsed ? styles.collapsedBadge : ""}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={styles.collapseBtn}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <i
            className={`fa-solid ${isCollapsed ? "fa-chevron-right" : "fa-chevron-left"
              } ${styles.collapseIcon}`}
          ></i>
          <span className={styles.collapseLabel}>Collapse</span>
        </button>
      </aside>

      {/* Main Content Pane (Right) */}
      <div className={styles.mainPane}>
        {/* Top Navbar */}
        <header className={styles.topNavbar}>
          {/* Left Breadcrumb & Burger Trigger */}
          <div className={styles.navLeft}>
            <button
              className={styles.burgerBtn}
              onClick={() => setIsMobileOpen(true)}
              title="Open Menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className={styles.breadcrumb}>{getBreadcrumbs()}</div>
          </div>

          {/* Center Search */}
          {/* <div className={styles.searchContainer}>
            <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
            />
          </div> */}

          {/* Right Header Actions */}
          <div className={styles.headerActions}>
            <div className={styles.notificationWrapper}>
              <i className={`fa-regular fa-bell ${styles.bellIcon}`}></i>
              <span className={styles.bellBadge}>3</span>
            </div>

            <div className={styles.profileWrapper}>
              <div className={styles.avatar}>{adminInfo?.firstName?.charAt(0)}{adminInfo?.lastName?.charAt(0)}</div>
              <span className={styles.profileName}>{adminInfo?.firstName} {adminInfo?.lastName}</span>
            </div>

            <button className={styles.exitBtn} onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Exit</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className={styles.pageBody}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

