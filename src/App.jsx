
import { useContext, useEffect } from 'react'
import './App.css'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Login from "./Components/Login/Login"
import Main from './Components/Main/Main'
import Layout from './Components/Layout/Layout'
import Roles from './Components/Roles/Roles'
import MyPermissions from "./Components/MyPermissions/MyPermissions"

import { Toaster } from 'react-hot-toast'
import { userContext } from './context/userContext'
import Admin from './Components/Admin/Admin'

let routers = createBrowserRouter([
  {path : "/" , element : <Login /> },
  {path:"/main",element:<Main/>},
  {path:"/dashboard",element:<Layout/>,children:[
    {path:"",element:<Admin/>},
    {path:"roles",element:<Roles/>},
    {path:"my-permissions",element:<MyPermissions/>}
  ]},
  
])



function App() {


  let {setUserToken} = useContext(userContext)
    useEffect(()=>{
      if(localStorage.getItem("token")!==null){
        setUserToken(localStorage.getItem("token"))
      }
      
    } , [])


  return (
    <>
          <RouterProvider router={routers}></RouterProvider>
          <Toaster />
    </>
  )
}

export default App
