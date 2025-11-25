import React from 'react'
import style from './main.module.css'
import { Link } from 'react-router-dom'
export default function Main() {
  return (
    <div className={`${style.mainBody}`}>
      <div className="container">
        <div className={`row ${style.parentMain}`}>
          <Link className={`totalFont ${style.clientButton} col-12 col-md-6 col-lg-3`} to={'/profile'}

          >
            Client
          </Link>
          <Link className={`totalFont ${style.userButton} col-12 col-md-6 col-lg-3`}  to={'/dashboard'}

          >
            User
          </Link>
        </div>
      </div>

    </div>
  )
}
