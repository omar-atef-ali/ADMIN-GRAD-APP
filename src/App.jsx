
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
import ForgetPassword from './Components/ForgetPassword/ForgetPassword'
// import ConfirmEmail from './Components/ConfirmEmail/ConfirmEmail'
import ResetPassword from './Components/ResetPassword/ResetPassword'
import CheckEmail from './Components/CheckEmail/CheckEmail'
import ActivateAccount from './Components/ActivateAccount/ActivateAccount'
import Protected from './Components/Protected/Protected'
import ViewServies from './Components/ViewServies/ViewServies'
import EditServies from './Components/EditServies/EditServies'
let routers = createBrowserRouter([
  {path : "/" , element : <Login /> },
  {path:"/forget-password",element:<ForgetPassword/>},
  {path:"/check-email",element:<CheckEmail/>},
   {path:"/reset-password",element:<ResetPassword/>},
   {path:"/activate-account",element:<ActivateAccount/>},
  // {path:"/main",element:<Protected><Main/></Protected>},
  {path:"/dashboard",element:<Layout/>,children:[
    {path:"",element:<Admin/>},
    {path:"roles",element:<Roles/>},
    {path:"my-permissions",element:<MyPermissions/>},
    {path:"roles/:id",element:<RolesDetails/>} ,
    {path:"users",element:<Users/>},
    {path:"users/:id",element:<UserDetails/>},
    {path:"services/:id",element:<ViewServies/>},
    {path:"services/:id/edit",element:<EditServies/>}
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
