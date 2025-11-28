import React, { useContext, useEffect } from "react";
import style from "./RolesDetails.module.css";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { userContext } from "../../context/userContext";
import api from "../../api";

export default function RolesDetails() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [information, setInformation] = useState([]);

  const {userToken} = useContext(userContext)
  const {id} = useParams()
  async function getInfo() {

    const {data} = await api.get(`/Roles/${id}` , {
      headers: {
            Authorization: `Bearer ${userToken}`,
          },
    })
    console.log(data);
    setInformation(data)
    
  }
  useEffect(()=>{
    if(userToken && id){
      getInfo()
    }

  },[userToken , id])


  return (
    <div className={style.pdPage}>
      <div className={style.pdWrapper}>
        <div className={style.pdCard}>
          <div className={style.pdHeader}>
            <div className={`${style.UserParentInfo}`}>
              <h1 className={style.pdName}>{information.name} </h1>
              {/* <p className={style.pdSub}>oatef266sdsdsdsd@gmail.com</p> */}
            </div>

            <div className=" d-flex flex-column gap-2">
              <span
                className={`${style.pdBadge} ${
                   style.active
                }`}
              >
                { information.isDisabled? "Disabled" : "Enabled" }
              </span>
              
            </div>
            
          </div>

          <div className={style.pdContent}>
            <div className={`${style.pdGrid} row`}>
              {information.updatedById ?
              <div className={`${style.pdField} col-6 col-md-4`}>

                <button
                  className={`${style.pdUserBtn}`}
                >
                  <Link to={`/dashboard/roles/${information.createdById}`} className={`${style.userlink}`}>
                  <i className="fa-solid fa-user"></i></Link>
                  <span>Created By</span>
                </button>
              </div>
              :""}
              {information.updatedById ?
              <div className={`${style.pdField} col-6 col-md-4`}>

                <button
                  className={`${style.pdUserBtn} `}
                >
                  <Link to={`/dashboard/roles/${information.updatedById}`} className={`${style.userlink}`}>
                  <i className="fa-solid fa-user"></i></Link>
                  <span>Updated By</span>
                </button>
              </div>
              :""}

              {information.managededById ?
              <div className={`${style.pdField} col-6 col-md-4`}>

                <button
                  className={`${style.pdUserBtn}`}
                >
                  <Link to={`/dashboard/roles/${information.managededById}`} className={`${style.userlink}`}>
                  <i className="fa-solid fa-user"></i>
                  <span>Managed By</span></Link>
                </button>
              </div>  :"" }
            </div>

            <div className={style.pdDivider} />

            <div className={`${style.pdGrid2} row `}>
              <div className={`${style.pdBox} col-12  col-md-5`}>
                <label className={style.pdLabel}>Created On</label>
                <p className={style.pdDate}>
                  {information.updatedOn && (() => {
                    const date = new Date(information.updatedOn);
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
                <p className={style.pdDay}>
                  
                </p>
              </div>

              <div className={`${style.pdBox} col-12  col-md-5 ${style.blue}`}>
                <label className={style.pdLabel}>Updated On</label>
                <p className={style.pdDate}>
                  {information.createdOn && (() => {
                    const date = new Date(information.createdOn);
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
                <p className={`${style.pdDay} `}>
                  
                </p>
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
    </div>
  );
}
