import React, { useContext } from "react";
import style from "./NavBar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../context/userContext";

export default function NavBar() {
  const {setUserToken}=useContext(userContext)
  const navigate=useNavigate()
  function logout(){
     setUserToken(null)
     localStorage.removeItem("token");
     localStorage.removeItem("refreshToken")
     navigate("/")
  }
  return (
    <>
      <div className={`${style.demosection}`}>
        <nav
          className={`navbar navbar-expand-lg navbar-dark ${style.navbargradient}`}
        >
          <div className="container px-4">
            <Link
              className={`navbar-brand ${style.logo} totalFont mx-1 `}
              to={"/dashboard"}
            >
              AdminHub
            </Link>

            
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
                  <Link
                    className={`nav-link totalFont mx-3 mx-lg-3  ${style.mainbtns}`}
                    to={"/dashboard"}
                  >
                   <i className="fa-solid fa-chart-line totalFont"></i> Dashboard
                  </Link>
                </li>

                <li className="nav-item mx-2">
                  <Link
                    className={`nav-link totalFont mx-3 ${style.mainbtns}`}
                    to={"/dashboard/Users"}
                  >
                   <i className="fa-solid fa-users totalFont"></i> Users
                  </Link>
                </li>

                <li className="nav-item mx-2">
                  <Link
                    className={`nav-link totalFont mx-3 mx-lg-3 ${style.mainbtns}`}
                    to={"roles"}
                  >
                   <i className={"totalFont  fa-solid fa-shield"}></i> Roles
                  </Link>
                </li>

                <li className="nav-item mx-2">
                  <Link
                    className={`nav-link totalFont mx-3  ${style.mainbtns}`}
                    to={"#"}
                  >
                   <i className="fa-solid fa-user"></i> Account
                  </Link>
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
