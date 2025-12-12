
// NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import style from "./NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={style.notfoundContainer}>
      <div className={style.content}>
        <h1 className={style.title}>404</h1>
        <p className={style.message}>Oops! Page not found.</p>
        <p className={style.description}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <button className={style.homeBtn} onClick={() => navigate("/dashboard")}>
          Go to Home
        </button>
      </div>
    </div>
  );
}
