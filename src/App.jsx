
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
import RolesDetails from './Components/RolesDetails/RolesDetails'
import UserDetails from './Components/UserDetails/UserDetails'
import Protected from './Components/Protected/Protected'
let routers = createBrowserRouter([
  {path : "/" , element : <Login /> },
  {path:"/main",element:<Protected><Main/></Protected>},
  {path:"/dashboard",element:<Layout/>,children:[
     {path:"/dashboard/:id",element: <Protected><UserDetails/></Protected> },
    {path:"",element:<Protected><Admin/></Protected>},
    {path:"roles",element:<Protected><Roles/></Protected>},
    {path:"my-permissions",element:<Protected><MyPermissions/></Protected>},
    {path:"roles/:id",element:<Protected><RolesDetails/></Protected>} ,
    {path:"users",element:<Protected><Users/></Protected>},
    {path:"users/:id",element:<Protected><UserDetails/></Protected>}
    
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
