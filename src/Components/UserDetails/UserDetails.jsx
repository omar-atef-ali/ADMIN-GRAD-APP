import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from "../../api";
import { userContext } from '../../context/userContext';
import style from "./UserDetails.module.css";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
export default function UserDetails() {
  const { id } = useParams()
  const navigate = useNavigate();
  const { userToken } = useContext(userContext)
  const [userDetails, setuserDetails] = useState([])
  const [loading, setlaoding] = useState(false)
  console.log(id)

  async function getUserDetails() {
    try {
      setlaoding(true)
      const response = await api.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      console.log(response.data)
      setuserDetails(response.data)
    }
    catch (error) {
      console.log(error)
    }
    finally {
      setlaoding(false)
    }
  }

  useEffect(() => {
    if (userToken) {
      getUserDetails()
    }
  }, [id, userToken])
  return (
    <div className={style.pdPage}>
      {loading ? <div className={style.overlay}>
        <div className={style.spinner}></div>
      </div> : <div className={style.pdWrapper}>
        <div className={style.pdCard}>
          <div className={style.pdHeader}>
            <div className={`${style.UserParentInfo}`}>
              <h1 className={style.pdName}>{`${userDetails.firstName} ${userDetails.lastName}`}</h1>
              <p className={style.pdSub}>{userDetails.email}</p>
              <p className={style.pdSub}>Role : {userDetails.role}</p>
            </div>

            <div className=" d-flex flex-column gap-2">
              <span
                className={`${style.pdBadge} ${style.active
                  }`}
              >
                {userDetails.isDisabled ? "Disapled" : "Enapled"}
              </span>
              <span
                className={`${style.pdBadge} ${style.active
                  }`}
              >
                {userDetails.isLocked ? "InActvie" : "Active"}
              </span>
            </div>

          </div>

          <div className={style.pdContent}>
            <div className={`${style.pdGrid} `}>

              {userDetails.createdById ? (
                <div className={`${style.pdField}`}>
                  <button
                    className={`${style.pdUserBtn}`}
                    onClick={() => {
                      if (userDetails.createdById === userDetails.id) {
                        
                        Swal.fire({
                          icon: "info",
                          title: "Notice",
                          text: "You are the one who created this user!",
                          confirmButtonColor: "#1068af",
                        });
                      } else {
                        
                        navigate(`/dashboard/users/${userDetails.createdById}`);
                      }
                    }}
                  >
                    <i className="fa-solid fa-user"></i> Created By
                  </button>
                </div>
              ) : null}


              {userDetails.updatedById ? (
                <div className={`${style.pdField}`}>
                  <button
                    className={`${style.pdUserBtn}`}
                    onClick={() => {
                      if (userDetails.updatedById === userDetails.id) {

                        Swal.fire({
                          icon: 'info',
                          title: 'Notice',
                          text: 'You are the one who updated this user!',
                          confirmButtonColor: '#373838ff',
                          background: "#1f1f1f",
                          color: "#fff",
                        });
                      } else {

                        window.location.href = `/dashboard/users/${userDetails.updatedById}`;
                      }
                    }}
                  >
                    <i className="fa-solid fa-user"></i> Updated By
                  </button>
                </div>
              ) : null}


            </div>

            <div className={style.pdDivider} />

            <div className={`${style.pdGrid2} row `}>
              <div className={`${style.pdBox} col-12  col-md-5`}>
                <label className={style.pdLabel}>Created On</label>
                <p className={style.pdDate}>
                  {userDetails.createdOn && (() => {
                    const date = new Date(userDetails.createdOn);
                    const formattedDate = date.toLocaleDateString(); // YYYY-MM-DD حسب لغة الجهاز
                    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                    return (
                      <>
                        <span>{formattedDate}</span><br />
                        <span>{formattedTime}</span>
                      </>
                    );
                  })()}
                </p>
              </div>

              <div className={`${style.pdBox} col-12  col-md-5 ${style.blue}`}>
                <label className={style.pdLabel}>Updated On</label>
                <p className={style.pdDate}>
                  {userDetails.updatedOn && (() => {
                    const date = new Date(userDetails.updatedOn);
                    const formattedDate = date.toLocaleDateString();
                    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                    return (
                      <>
                        <span>{formattedDate}</span><br />
                        <span>{formattedTime}</span>
                      </>
                    );
                  })()}
                </p>
              </div>
            </div>


          </div>


        </div>
      </div>}
    </div>



  )

}
