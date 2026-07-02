
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
import ViewServices from './Components/ViewServices/ViewServices'
import EditServices from './Components/EditServices/EditServices'
import Services from './Components/Services/Services'
import AddServices from './Components/AddServices/AddServices'
import ViewPackeges from './Components/ViewPackeges/ViewPackeges'
import Packages from './Components/Packages/Packages'
import AddPackages from './Components/AddPackages/AddPackages'
import EditPackages from './Components/EditPackages/EditPackages'
import Clients from './Components/Clients/Clients'
let routers = createBrowserRouter([
  {path : "/" , element : <Login /> },
  {path:"/forget-password",element:<ForgetPassword/>},
  {path:"/check-email",element:<CheckEmail/>},
   {path:"/reset-password",element:<ResetPassword/>},
   {path:"/activate-account",element:<ActivateAccount/>},
  // {path:"/main",element:<Protected><Main/></Protected>},
  {path:"/dashboard",element:<Layout/>,children:[
    {path:"",element:<Admin/>},
    {path:"clients",element:<Protected><Clients/></Protected>},
    {path:"roles",element:<Roles/>},
    {path:"my-permissions",element:<MyPermissions/>},
    {path:"roles/:id",element:<RolesDetails/>} ,
    {path:"users",element:<Users/>},
    {path:"users/:id",element:<UserDetails/>},
    {path:"services",element:<Protected><Services/></Protected>},

    {path:"services/add",element:<Protected><AddServices/></Protected>},
    {path:"services/:id",element:<Protected><ViewServices/></Protected>},
    {path:"services/:id/edit",element:<Protected><EditServices/></Protected>},
    {path:"packages/:id",element:<Protected><ViewPackeges/></Protected>},
    {path:"packages/:id/edit",element:<Protected><EditPackages/></Protected>},
    {path:"packages",element:<Protected><Packages/></Protected>},
    {path:"packages/add",element:<Protected><AddPackages/></Protected>},


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
