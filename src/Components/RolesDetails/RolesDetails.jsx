import React, { useContext, useEffect } from "react";
import style from "./RolesDetails.module.css";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { userContext } from "../../context/userContext";
import api from "../../api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function RolesDetails() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [information, setInformation] = useState([]);
  const [loading, setlaoding] = useState(false);
  const navigate = useNavigate();

  const { userToken } = useContext(userContext);
  const { id } = useParams();
  async function getInfo() {
    try {
      setlaoding(true);
      const { data } = await api.get(`/Roles/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log(data);
      setInformation(data);
    } catch (error) {
      console.log(error);
      toast.error(
          error.response?.data?.errors[1] ||
          "Something went wrong.",
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
    } finally {
      setlaoding(false);
    }
  }
  useEffect(() => {
    if (userToken && id) {
      getInfo();
    }
  }, [userToken, id]);

  return (
    <div className={style.pdPage}>
      {loading ? (
        <div className={style.overlay}>
          <div className={style.spinner}></div>
        </div>
      ) : (
        <div className={style.pdWrapper}>
          <div className={style.pdCard}>
            <div className={style.pdHeader}>
              <div className={`${style.UserParentInfo}`}>
                <h1 className={style.pdName}>{information.name} </h1>
                {/* <p className={style.pdSub}>oatef266sdsdsdsd@gmail.com</p> */}
              </div>

              <div className=" d-flex flex-column gap-2">
                <span className={`${style.pdBadge} ${style.active}`}>
                  {information.isDisabled ? "Disabled" : "Enabled"}
                </span>
              </div>
            </div>

            <div className={style.pdContent}>
              <div className={`${style.pdGrid} row`}>
                {information.updatedById ? (
                  <div className={`${style.pdField} col-6 col-md-4`}>
                    <button className={`${style.pdUserBtn}`}
                      onClick={() => {
                        if (information.createdById === information.id) {
                          Swal.fire({
                            icon: "info",
                            title: "Notice",
                            text: "You are the one who created this user!",
                            confirmButtonColor: "#1068af",
                          });
                        } else {
                          navigate(
                            `/dashboard/roles/${information.createdById}`
                          );
                        }
                      }}>
                      <i className="fa-solid fa-user"></i>
                      <span>Created By</span>
                    </button>
                  </div>
                ) : (
                  ""
                )}
                {information.updatedById ? (
                  <div className={`${style.pdField} col-6 col-md-4`}>
                    <button className={`${style.pdUserBtn} `}
                      onClick=
                      {() => {
                        if (information.updatedById === information.id) {
                          Swal.fire({
                            icon: "info",
                            title: "Notice",
                            text: "You are the one who updated this user!",
                            confirmButtonColor: "#373838ff",
                            background: "#1f1f1f",
                            color: "#fff",
                          });
                        } else {
                          navigate(`/dashboard/roles/${information.updatedById}`);
                        }
                      }}>
                      <i className="fa-solid fa-user"></i>
                      <span>Updated By</span>
                    </button>
                  </div>
                ) : (
                  ""
                )}

                {information.managededById ? (
                  <div className={`${style.pdField} col-6 col-md-4`}>
                    <button className={`${style.pdUserBtn}`}
                      onClick=
                      {() => {
                        if (information.managededById === information.id) {
                          Swal.fire({
                            icon: "info",
                            title: "Notice",
                            text: "You are the one who updated this user!",
                            confirmButtonColor: "#373838ff",
                            background: "#1f1f1f",
                            color: "#fff",
                          });
                        } else {
                          navigate(`/dashboard/roles/${information.managededById}`);
                        }
                      }} >                     
                        <i className="fa-solid fa-user"></i>
                        <span>Managed By</span>
                      
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className={style.pdDivider} />

              <div className={`${style.pdGrid2} row `}>
                <div className={`${style.pdBox} col-12  col-md-5`}>
                  <label className={style.pdLabel}>Created On</label>
                  <p className={style.pdDate}>
                    {information.updatedOn &&
                      (() => {
                        const date = new Date(information.updatedOn);
                        const formattedDate = date.toLocaleDateString(); // YYYY-MM-DD حسب لغة الجهاز
                        const formattedTime = date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        });
                        return (
                          <>
                            <span>{formattedDate}</span>
                            <br />
                            <span>{formattedTime}</span>
                          </>
                        );
                      })()}
                  </p>
                  <p className={style.pdDay}></p>
                </div>

                <div
                  className={`${style.pdBox} col-12  col-md-5 ${style.blue}`}
                >
                  <label className={style.pdLabel}>Updated On</label>
                  <p className={style.pdDate}>
                    {information.createdOn &&
                      (() => {
                        const date = new Date(information.createdOn);
                        const formattedDate = date.toLocaleDateString(); // YYYY-MM-DD حسب لغة الجهاز
                        const formattedTime = date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        });
                        return (
                          <>
                            <span>{formattedDate}</span>
                            <br />
                            <span>{formattedTime}</span>
                          </>
                        );
                      })()}
                  </p>
                  <p className={`${style.pdDay} `}></p>
                </div>
              </div>

              {selectedUser && (
                <div className={style.pdSelectedBox}>
                  <p>
                    <strong>Selected User:</strong> {selectedUser}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
