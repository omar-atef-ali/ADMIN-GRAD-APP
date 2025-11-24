import { useContext, useEffect } from 'react'
import './App.css'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Login from "./Components/Login/Login"
import Layout from "./Components/Layout/Layout"
import { Toaster } from 'react-hot-toast'
import Protected from './Components/Protected/Protected'
import { userContext } from './context/userContext'
import Home from './Components/Home/Home'
import Roles from './Components/Roles/Roles'

let routers = createBrowserRouter([
  {path : "login" , element : <Login /> } ,
  {path:"/" , element: <Login/>} , 
  {path:"roles" , element: <Roles/>} , 
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
