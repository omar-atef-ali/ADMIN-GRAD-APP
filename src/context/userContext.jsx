import { createContext, useContext, useEffect, useState } from "react";




export let userContext = createContext();

export default function UserContextProvider(props) {
  let [userToken, setUserToken] = useState(null);
  let [loading, setLoading] = useState(true);
  let [email,setemail]=useState('')

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setUserToken(token);
    }
    setLoading(false); 

  }, []);

  return (
    <>
      <userContext.Provider value={{ userToken, setUserToken ,loading ,email,setemail}}>
        {props.children}
      </userContext.Provider>
    </>
  );
}
