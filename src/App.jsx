
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
import Users from './Components/Users/Users'
import NotFound from './Components/Notfound/NotFound'
import UserDetails from './Components/UserDetails/UserDetails'

let routers = createBrowserRouter([
  {path : "/" , element : <Login /> },
  {path:"/main",element:<Main/>},
  {path:"/dashboard",element:<Layout/>,children:[
     {path:"/dashboard/:id",element:<UserDetails/>},
    {path:"",element:<Admin/>},
    {path:"roles",element:<Roles/>},
    {path:"my-permissions",element:<MyPermissions/>},
    {path:"users",element:<Users/>},
    {path:"users/:id",element:<UserDetails/>}
    
  ]},
  {path:"*",element:<NotFound/>}
  
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
