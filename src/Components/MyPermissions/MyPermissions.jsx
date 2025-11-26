import React, { useContext, useEffect, useState } from "react";
import style from "./MyPermissions.module.css";
import api from "../../api";
import { userContext } from "../../context/userContext";

export default function MyPermissions() {
  const userId = localStorage.getItem("id");
  const { userToken } = useContext(userContext);
  const [showModal, setShowModal] = useState(false);
  const [permissions, setPermissions] = useState({});

  async function Permissions() {
    try {
      const { data } = await api.get(
        `/Roles/0199c269-21d2-7a6e-ac81-4363dba4a866`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      console.log(data.permissions);
      setPermissions(data.permissions);
      console.log(permissions);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (userId && userToken) {
      Permissions();
    }
  }, [userId, userToken]);

  return (
    <>
      <div className={` container-fluid ${style.MyPermissionsPage}`}></div>

      <h2 className={`${style.permissionsH} totalFont`}>My Permissions</h2>
    </>
  );
}
