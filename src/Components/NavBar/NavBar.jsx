import React, { useContext } from "react";
import style from "./NavBar.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { userContext } from "../../context/userContext";

export default function NavBar() {
  const { setUserToken } = useContext(userContext)
  const navigate = useNavigate()
  function logout() {
    setUserToken(null)
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("id")
    navigate("/")
  }
  return (
    <>
      <div className={`${style.demosection}`}>
        <nav
          className={`navbar navbar-expand-lg navbar-dark ${style.navbargradient}`}
        >
          <div className="container px-4">
            <NavLink
              className={({ isActive }) => `${style.logo} totalFont mx-1 navbar-brand ${isActive ? style.active : ""}`}

              to={"/main"}
            >
              AdminHub
            </NavLink>


            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav2"
              aria-controls="navbarNav2"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* القائمة */}
            <div
              className={`collapse navbar-collapse ${style.navCollapseZ}`}
              id="navbarNav2"
            >
              <ul className="navbar-nav mx-auto">
                <li className="nav-item mx-2">
                  <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                      `nav-link totalFont mx-3 mx-lg-3 ${style.mainbtns} ${isActive ? style.active : ""
                      }`
                    }
                  >
                    <i className="fa-solid fa-chart-line totalFont"></i> Dashboard
                  </NavLink>


                </li>

                <li className="nav-item mx-2">
                  <NavLink
                    className={({isActive})=>`nav-link totalFont mx-3 ${style.mainbtns} ${isActive ? style.active : ""}`}
                    to={"/dashboard/Users"}
                  >
                    <i className="fa-solid fa-users totalFont"></i> Users
                  </NavLink>
                </li>

                <li className="nav-item mx-2">
                  <NavLink
                    
                    className={({isActive})=>`nav-link totalFont mx-3 mx-lg-3 ${style.mainbtns} ${isActive ? style.active : ""} `}
                    to={"roles"}
                  >
                    <i className={"totalFont  fa-solid fa-shield"}></i> Roles
                  </NavLink>
                </li>

                <li className="nav-item mx-2">
                  <NavLink
                    
                    className={({isActive})=>`nav-link totalFont mx-3  ${style.mainbtns} ${isActive ? style.active : ""} `}
                    to={"/ds"}
                  >
                    <i className="fa-solid fa-user"></i> Account
                  </NavLink>
                </li>
                <li className="nav-item mx-2">
                  <NavLink
                    
                    className={({isActive})=>`nav-link totalFont mx-3 mx-lg-3 ${style.mainbtns}  ${isActive ? style.active : ""}`}
                    to={"my-permissions"}
                  >
                    <i className={`totalFont  fa-solid fa-list-check`}></i> My Permissions
                  </NavLink>
                </li>
              </ul>
              <li className="nav-item" style={{ listStyle: "none" }}>
                <button
                  onClick={logout}
                  className={` ms-2  totalFont ${style.borderbtn} ${style.logoutbtn}`}
                  style={{
                    marginLeft: "50px",
                  }}
                >
                  Logout
                </button>
              </li>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
