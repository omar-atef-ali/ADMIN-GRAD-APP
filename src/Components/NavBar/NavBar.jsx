import React from "react";
import style from "./NavBar.module.css";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <>
      <div className={`${style.demosection}`}>
        <nav
          className={`navbar navbar-expand-lg navbar-dark ${style.navbargradient}`}
        >
          <div className="container px-4">
            <Link
              className={`navbar-brand ${style.logo} totalFont mx-1 `}
              to={"/home"}
            >
              DeebAI
            </Link>

            {/* زرار فتح القائمة في الموبايل */}
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
            <div className={`collapse navbar-collapse ${style.navCollapseZ}`} id="navbarNav2">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item mx-2">
                  <Link
                    className={`nav-link totalFont mx-3 mx-lg-2  ${style.mainbtns}`}
                    to={"/home"}
                  >
                    Home
                  </Link>
                </li>

                <li className="nav-item mx-2">
                  <Link
                    className={`nav-link totalFont mx-3 ${style.mainbtns}`}
                    to={"/tableau"}
                  >
                    Demo
                  </Link>
                </li>

                <li className="nav-item mx-2">
                  <Link
                    className={`nav-link totalFont mx-3 mx-lg-2 ${style.mainbtns}`}
                    to={"/features"}
                  >
                    Features
                  </Link>
                </li>

                <li className="nav-item mx-2">
                  <Link
                    className={`nav-link totalFont mx-3 ${style.mainbtns}`}
                    to={"/pricing"}
                  >
                    Pricing
                  </Link>
                </li>

                <li className="nav-item mx-2">
                  <Link
                    className={`nav-link totalFont mx-3 mx-lg-2 ${style.mainbtns}`}
                    to={"#"}
                  >
                    Contact
                  </Link>
                </li>

                <li className="nav-item mx-2">
                  <Link
                    className={`nav-link totalFont mx-3 mx-lg-2 ${style.mainbtns}`}
                    style={{ marginRight: "25px" }}
                    to={"#"}
                  >
                    About us
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`btn btn-outline-light ms-2 totalFont  my-2 my-lg-0 ${style.freebtn}`}
                    to={"#"}
                  >
                    Free Trail
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={` ms-2  totalFont ${style.borderbtn} ${style.loginbtn}`}
                    to={"/login"}
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
