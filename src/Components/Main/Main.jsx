import React from 'react'
import style from './main.module.css'
import { Link } from 'react-router-dom'
export default function Main() {
  return (
    <div className={`${style.mainBody}`}>
      <div className="container">
        <div className={`${style.parentMain}`}>
          <Link className='totalFont' to={'/profile'}
            style={{
              backgroundColor: "#1a1a1aff",
              color: "#ffffff",
              border: "1px solid #007bff",
              borderRadius: "8px",
              padding: "20px 50px",
              fontWeight: "500",
              fontSize: "18px",
              cursor: "pointer",
              textDecoration: "none"
            }}

          >
            User
          </Link>
          <Link className='totalFont' to={'/dashboard'}
            style={{
              backgroundColor: "#1a1a1aff",
              color: "#ffffff",
              border: "1px solid #007bff",
              borderRadius: "8px",
              padding: "20px 45px",
              fontWeight: "500",
              fontSize: "18px",
              cursor: "pointer",
              textDecoration: "none"
            }}

          >
            Admin
          </Link>
        </div>
      </div>

    </div>
  )
}
