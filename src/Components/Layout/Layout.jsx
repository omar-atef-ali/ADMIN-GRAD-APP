import { useContext, useState } from "react";
import styles from "./Layout.module.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaHome, FaChartBar, FaUsers, FaBox, FaCog, FaBars, FaChevronLeft } from "react-icons/fa";
import { userContext } from "../../context/userContext";

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
   const navigate=useNavigate()
   const { setUserToken } = useContext(userContext)
  const toggleSidebar = () => {

    setMobileOpen(!mobileOpen);
  };

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
      {/* Mobile toggle button */}
      <button
        className={`${styles.mobileToggle} ${mobileOpen ? styles.mobileOpen : ""}`}
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>


      {/* Sidebar */}
      <nav
        className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}
      >
        {/* هذا الزر يقدر تشيله لو مش عايز المستخدم يقفل sidebar على desktop */}
        {/* <button className={styles.toggleBtn} onClick={toggleSidebar}>
          <FaChevronLeft />
        </button> */}

        <div className={styles.logoSection}>
          <h4 className={styles.logoText}>DeebAI</h4>
        </div>

        <div className={styles.navLinks}>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ""}`}
          >
            <FaHome className={styles.icon} />
            <span className={styles.hideOnCollapse}>Dashboard</span>
          </NavLink>

          <NavLink to="users" className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ""}`}>
            <FaChartBar className={styles.icon} />
            <span className={styles.hideOnCollapse}>Users</span>
          </NavLink>
          <NavLink to="roles" className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ""}`}>
            <FaUsers className={styles.icon} />
            <span className={styles.hideOnCollapse}>Roles</span>
          </NavLink>
          <NavLink to="my-permissions" className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ""}`}>
            <FaBox className={styles.icon} />
            <span className={styles.hideOnCollapse}>Permissions</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ""}`}>
            <FaCog className={styles.icon} />
            <span className={styles.hideOnCollapse}>Settings</span>
          </NavLink>
        </div>

        <div className={styles.logout}>
          <button onClick={logout} className="btn btn-danger w-100">Logout</button>
        </div>
      </nav>

      {/* Overlay للـ mobile */}
      {mobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </>
  );
}
