import React, { useContext, useEffect, useState } from "react";
import style from "./MyPermissions.module.css";
import api from "../../api";
import { userContext } from "../../context/userContext";
import toast from "react-hot-toast";

export default function MyPermissions() {
  const userId = localStorage.getItem("id");
  const { userToken } = useContext(userContext);
  const [showModal, setShowModal] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [selected, setSelected] = useState({});
  const [data, setData] = useState({});

  async function Permissions() {
    try {
      const { data } = await api.get(
        `/Roles/cc874352-c0b4-43f3-a621-d7189ba87172`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      setShowModal(true);
      setData(data);

      // console.log(data.permissions);
      setPermissions(data.permissions);
      // console.log(permissions);
    } catch (error) {
      console.log(error?.response?.data?.errors[1]);
      toast.error(
        error?.response?.data?.errors[1] ||
          "Failed to fetch role details.",
        {
          position: "top-center",
          duration: 4000,
          style: {
            background:
              "linear-gradient(to right, rgba(121, 5, 5, 0.9), rgba(171, 0, 0, 0.85))",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "16px 20px",
            color: "#ffffff",
            fontSize: "0.95rem",
            borderRadius: "5px",
            width: "300px",
            height: "60px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
          },
          iconTheme: {
            primary: "#FF4D4F",
            secondary: "#ffffff",
          },
        }
      );
    }
  }

  useEffect(() => {
    if (Array.isArray(permissions)) {
      const init = {};

      permissions.forEach((perm) => {
        init[perm.name] = {
          add: true,
          inheritable: perm.isInheritable,
        };
      });

      setSelected(init);
    }
  }, [permissions]);

  useEffect(() => {
    if (userId && userToken) {
      Permissions();
    }
  }, [userId, userToken]);

  return (
    <>
      <div className={` container-fluid ${style.MyPermissionsPage}`}>
        <h2 className={`${style.permissionsH} totalFont`}>My Permissions</h2>

        {showModal && (
          <>
            {/* صندوق الـ Modal */}
            <div
              style={{
                position: "fixed",
                top: "60%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#0f0f0f",
                padding: "25px",
                borderRadius: "15px",
                width: "450px",
                maxWidth: "90%",
                color: "white",
                boxShadow: "0 0 7px #000",
              }}
            >
              <h3 className="totalFont" style={{ marginBottom: "20px" }}>
                Permissions
              </h3>

              <label className="totalFont fs-4 mb-2" htmlFor="name">
                {data.name}
              </label>
              <div className={`${style.allDiv}`}>
                <div className={`${style.PermissionsDiv}`}>
                  <h5 className="totalFont">Permissions</h5>
                  {permissions.map((perm, index) => (
                    <p key={index} className="totalFont">
                      {perm.name}
                    </p>
                  ))}
                </div>

                {/* ----------------- ADD COLUMN ------------------- */}
                <div className={style.addDiv}>
                  <h5 className="totalFont">Add</h5>

                  {permissions.map((perm, index) => (
                    <div key={index} className="mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={true} // Add
                          disabled
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* ----------------- INHERITABLE COLUMN ------------------- */}
                <div className={style.inheritableDiv}>
                  <h5 className="totalFont">Inheritable</h5>

                  {permissions.map((perm, index) => (
                    <div key={index} className="mb-3 mx-4">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={perm.isInheritable}
                          disabled
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
