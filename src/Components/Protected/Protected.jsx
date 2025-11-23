
import React, { useContext } from 'react'
import style from "./Protected.module.css"
import { userContext } from '../../context/userContext'
import { Navigate } from 'react-router-dom'


export default function Protected(props) {

  let {userToken , loading} = useContext(userContext)

  if (loading) {
    return <div>Loading...</div>;
  }

  if(userToken !==null){
    return props.children
  }else{
    return <Navigate to={"/login"} />
  }




  return <>

  
  </>
}
