import React from "react";
import style from "./Footer.module.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className={`mt-auto ${style.footer}`}>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-4">
              <Link className={`totalFont ${style.footerLogo}`}
               to={'#'}>
                DeebAI
              </Link>
            </div>
            <div className="col-12 col-md-4 mb-3">
              <h5 className="totalFont">Explore</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to={'/home'} className={`totalFont  ${style.footerLinks}`}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to={'#'} className={`totalFont ${style.footerLinks}`}>
                    Demos
                  </Link>
                </li>
                <li>
                  <Link to={'#'} className={`totalFont ${style.footerLinks}`}>
                    Features
                  </Link>
                </li>
                <li>
                  <Link to={'#'}className={`totalFont ${style.footerLinks}`}>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to={'#'}className={`totalFont ${style.footerLinks}`}>
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-12 col-md-4 mb-3">
              <h5 className="totalFont">Support</h5>
               <ul className="list-unstyled">
                <li>
                  <Link to={'#'}className={`totalFont ${style.footerLinks}`}>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to={'#'}className={`totalFont ${style.footerLinks}`}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to={'#'}className={`totalFont ${style.footerLinks}`}>
                    Refund Policy
                  </Link>
                </li>
                
              </ul>
            </div>
          </div>
          <hr className="mb-4" />
        </div>
        <div className="footer-copyright text-center py-3">
          © 2025 Copyright
          <span> DeebAI</span>
        </div>
      </footer>
    </>
  );
}
