import React, { useContext, useEffect } from "react";
import style from "./RolesDetails.module.css";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { userContext } from "../../context/userContext";
import api from "../../api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function RolesDetails() {
  const [information, setInformation] = useState([]);
  const myId = localStorage.getItem("id");
  const [loading, setlaoding] = useState(false);
  const navigate = useNavigate();

  const { userToken } = useContext(userContext);
  const { id } = useParams();

  //////////////////////////////////////////////////////////////

  async function getInfo() {
    try {
      setlaoding(true);
      const { data } = await api.get(`/Roles/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      // console.log(data);
      setInformation(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.errors[1] || "Something went wrong.", {
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
      });
    } finally {
      setlaoding(false);
    }
  }
  useEffect(() => {
    if (userToken && id) {
      getInfo();
    }
  }, [userToken, id]);

  /////////////////////////////////////////////////////
  const [permissions, setPermissions] = useState([]);
  const [data, setData] = useState({});
  const [selected, setSelected] = useState({});

  async function Permissions() {
    try {
      const { data } = await api.get(`/Roles/${id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      // setShowModal(true);
      setData(data);

      // console.log(data.permissions);
      setPermissions(data.permissions);
      // console.log(permissions);
    } catch (error) {
      console.log(error?.response?.data?.errors[1]);
      toast.error(
        error?.response?.data?.errors[1] || "Failed to fetch role details.",
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
    if (id && userToken) {
      Permissions();
    }
  }, [id, userToken]);

  return (
    <div className={style.pdPage}>
      {loading ? (
        <div className={style.overlay}>
          <div className={style.spinner}></div>
        </div>
      ) : (
        <div className={style.pdWrapper}>
          {/* Back link */}
          <Link to="/admin/roles" className={style.backLink}>
            <i className="fa-solid fa-arrow-left"></i>
            <span className="totalFont">Back to Roles</span>
          </Link>

          <div className={style.pdCard}>
            <div className={style.pdHeader}>
              <div className={`${style.UserParentInfo}`}>
                <h1 className={`totalFont ${style.pdName}`}>{information.name} </h1>
              </div>

              <div className=" d-flex flex-column gap-2">
                <span className={`totalFont ${style.pdBadge} ${information.isDisabled ? style.disabled : style.active}`}>
                  {information.isDisabled ? "Disabled" : "Enabled"}
                </span>
              </div>
            </div>

            <div className={style.pdContent}>
              <div className={`${style.pdGrid} d-flex justify-content-around`}>
                {information.createdById ? (
                  <div className={`${style.pdField} `}>
                    <button
                      className={`${style.pdUserBtn}`}
                      onClick={() => {
                        navigate(`/dashboard/users/${information.createdById}`);
                      }}
                    >
                      <i className="fa-solid fa-user"></i>
                      <span className="totalFont">Created By</span>
                    </button>
                  </div>
                ) : (
                  ""
                )}
                {information.updatedById ? (
                  <div className={`${style.pdField} `}>
                    <button
                      className={`${style.pdUserBtn} `}
                      onClick={() => {
                        navigate(`/dashboard/users/${information.updatedById}`);
                      }}
                    >
                      <i className="fa-solid fa-user"></i>
                      <span className="totalFont">Updated By</span>
                    </button>
                  </div>
                ) : (
                  ""
                )}

                {information.managededById ? (
                  <div className={`${style.pdField} `}>
                    <button
                      className={`${style.pdUserBtn}`}
                      onClick={() => {
                        if (information.managededById === myId) {
                          Swal.fire({
                            icon: "info",
                            title: "Noticeeee",
                            text: "You are the one who updated this role!",
                            confirmButtonColor: "#2D0B14",
                            background: "#FAF8F6",
                            color: "#1C1814",
                            confirmButtonColor: "#2D0B14",
                            cancelButtonColor: "#8C8581",
                            customClass: {
                              popup: "custom-popup",
                            },
                          });
                        } else {
                          navigate(
                            `/dashboard/roles/${information.managededById}`
                          );
                        }
                      }}
                    >
                      <i className={"totalFont  fa-solid fa-shield"}></i>
                      <span className="totalFont">Managed By</span>
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className={style.pdDivider} />

              <div className={style.permissionsSection}>
                <h3 className={`${style.permissionsH3} totalFont`}>
                  Permissions
                </h3>

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
                    <h5 className="totalFont" style={{ textAlign: "center" }}>Add</h5>

                    {permissions.map((perm, index) => (
                      <div key={index} style={{ height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div className="form-check form-switch m-0 p-0">
                          <input
                            className="form-check-input m-0"
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
                    <h5 className="totalFont" style={{ textAlign: "center" }}>Inheritable</h5>

                    {permissions.map((perm, index) => (
                      <div key={index} style={{ height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div className="form-check form-switch m-0 p-0">
                          <input
                            className="form-check-input m-0"
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

              <div className={style.pdDivider} />

              <div className={`${style.pdGrid2} row `}>
                <div className={`${style.pdBox} col-12 col-md-5`}>
                  <label className={style.pdLabel}>Created On</label>
                  <p className={style.pdDate}>
                    {information.createdOn &&
                      (() => {
                        const date = new Date(information.createdOn);
                        const formattedDate = date.toLocaleDateString();
                        const formattedTime = date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        });
                        return (
                          <>
                            <span className={style.dateText}>{formattedDate}</span>
                            <span className={style.timeText}>{formattedTime}</span>
                          </>
                        );
                      })()}
                  </p>
                </div>

                <div className={`${style.pdBox} col-12 col-md-5`}>
                  <label className={style.pdLabel}>Updated On</label>
                  <p className={style.pdDate}>
                    {information.updatedOn &&
                      (() => {
                        const date = new Date(information.updatedOn);
                        const formattedDate = date.toLocaleDateString();
                        const formattedTime = date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        });
                        return (
                          <>
                            <span className={style.dateText}>{formattedDate}</span>
                            <span className={style.timeText}>{formattedTime}</span>
                          </>
                        );
                      })()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
