

import React from 'react'
import style from "./Layout.module.css"
import { Outlet } from 'react-router-dom'
import NavBar from '../NavBar/NavBar'

export default function Layout() {
  return <>
    <NavBar/>
    <Outlet></Outlet>
  
  </>
}

