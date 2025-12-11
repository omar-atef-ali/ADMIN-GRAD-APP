import { useContext, useState } from "react";
import React from "react";
import { userContext } from "../../context/userContext";
import styles from "./Layout.module.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaHome, FaChartBar, FaUsers, FaBox, FaCog, FaBars, FaTimes } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { PiListBulletsBold } from "react-icons/pi";



export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setMobileOpen(!mobileOpen);
  const navigate =useNavigate()
  const { setUserToken } = useContext(userContext)



  function logout() {
    setUserToken(null)
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("id")
    localStorage.removeItem("email")
    navigate("/")
  }


  return (
    <>
      {/* Sidebar */}
      <nav className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
        {/* Toggle button داخل sidebar للموبايل فقط */}
        <button
          className={`${styles.mobileToggle} ${mobileOpen ? styles.openBtn : ""}`}
          onClick={toggleSidebar}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={styles.logoSection}>
          <h4 className={styles.logoText}>DeebAI</h4>
        </div>

        <div className={styles.navLinks}>
          <NavLink to="/dashboard" end className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ""}`}>
            <FaChartBar className={styles.icon} /><span className={styles.hideOnCollapse}>Dashboard</span>
          </NavLink>
          <NavLink to="/jlk" end className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ""}`}>
            <IoPersonSharp className={styles.icon} /><span className={styles.hideOnCollapse}>Client</span>
          </NavLink>
          <NavLink to="users" className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ""}`}>
            <FaUsers className={styles.icon} /><span className={styles.hideOnCollapse}>Users</span>
          </NavLink>
          <NavLink to="roles" className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ""}`}>
            <FaShield className={styles.icon} /><span className={styles.hideOnCollapse}>Roles</span>
          </NavLink>
          <NavLink to="my-permissions" className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ""}`}>
            <PiListBulletsBold className={styles.icon} /><span className={styles.hideOnCollapse}>Permissions</span>
          </NavLink>
          
        </div>

        <div className={styles.logout}>
          <button onClick={logout} className="btn btn-danger w-100">Logout</button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${mobileOpen ? styles.overlayOpen : ""}`}
        onClick={() => setMobileOpen(false)}
      ></div>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </>
  );
}
