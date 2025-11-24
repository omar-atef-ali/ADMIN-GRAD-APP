import React from 'react'
import style from './admin.module.css'
export default function Admin() {
    return (


        <div className={`container-fluid ${style.AdminBody}`}>
            <div className={`${style.parent_Admin}`}>
                <h1 className={`${style.adminTilte} totalFont`} style={{
                    color: "white",
                    fontSize: "2.25rem",
                    lineHeight: "1.2",
                    background: "linear-gradient(to right, white, #bcbcbcff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}>Dashboard</h1>
                <div className={`row ${style.parentKpis}`}>
                    <div className={`${style.Kpis} col-12 col-md-6 col-lg-2`}>
                        <div className={`${style.KpisInfo}`}>
                            <i className={`${style.kpisIcon} totalFont fa-solid fa-users`}></i>
                            <h7 className="totalFont text-white">+12</h7>
                        </div>
                        <h3 className={`totalFont text-white ${style.count}`}>150</h3>
                        <h5 className={`totalFont text-white ${style.kpisRole}`}>Total Users</h5>
                    </div>
                    <div className={`${style.Kpis} col-12 col-md-6 col-lg-2`}>
                        <div className={`${style.KpisInfo}`}>
                            <i className={`${style.kpisIcon} totalFont fa-solid fa-chart-line`}></i>
                            <h7 className="totalFont text-white">+12</h7>
                        </div>
                        <h3 className={`totalFont text-white ${style.count}`}>150</h3>

                        <h5 className={`totalFont text-white ${style.kpisRole}`}>Active Users</h5>

                    </div>
                    <div className={`${style.Kpis} col-12 col-md-6 col-lg-2`}>
                        <div className={`${style.KpisInfo}`}>
                            <i className={`${style.kpisIcon} totalFont  fa-solid fa-shield`}></i>
                            <h7 className="totalFont text-white">+12</h7>
                        </div>
                        <h3 className={`totalFont text-white ${style.count}`}>150</h3>
                        <h5 className={`totalFont text-white ${style.kpisRole}`}>Role Count</h5>
                    </div>
                    <div className={`${style.Kpis} col-12 col-md-6 col-lg-2`}>
                        <div className={`${style.KpisInfo}`}>
                            <i className={`${style.kpisIcon} totalFont  fa-solid fa-lock`}></i>
                            <h7 className="totalFont text-white">+12</h7>
                        </div>
                        <h3 className={`totalFont text-white ${style.count}`}>150</h3>
                        <h5 className={`totalFont text-white ${style.kpisRole}`}>Locked Users</h5>
                    </div>
                    <div className={`${style.Kpis} col-12 col-md-6 col-lg-2`}>
                        <div className={`${style.KpisInfo}`}>
                            <i className={`${style.kpisIcon} totalFont fa-solid fa-ban`}></i>
                            <h7 className="totalFont text-white">+12</h7>
                        </div>
                        <h3 className={`totalFont text-white ${style.count}`}>150</h3>
                        <h5 className={`totalFont text-white ${style.kpisRole}`}>Disapled Users</h5>
                    </div>
                </div>
                <div className="container">
                    <div className={`row ${style.parentBtns}`}>
                        <button className={`${style.UserButton} totalFont  col-12 col-md-3`}
                            style={{
                                backgroundColor: "rgba(10, 104, 159, 0.884)",
                                color: "#ffffff",
                                border: "1px solid #000000ff",
                                borderRadius: "8px",
                                padding: "15px 50px",
                                fontWeight: "500",
                                fontSize: "18px",
                                cursor: "pointer",
                                textDecoration: "none"
                            }}

                        >
                            <i class="fa-solid fa-user-plus"></i> Add User
                        </button>
                        <button className={`${style.RoleButton} totalFont  col-12 col-md-3`}

                        >
                            <i class="fa-solid fa-circle-plus"></i> Add Role
                        </button>
                    </div>
                </div>
                <div className={`row mt-5 py-4 ${style.bgTable}`}>
                    <div className={`${style.rolesTable} col-12 col-md-6`}>
                        <div className={`${style.innerTable}`}>

                            <table
                                className={`${style.realTable} table-bordered table-hover `}
                            >
                                <thead>
                                    <tr className="sticky-top">
                                        <th style={{ width: "20%" }}>Name</th>
                                        <th style={{ width: "20%" }}>Email</th>
                                        <th style={{ width: "20%" }}>Role</th>
                                        <th style={{ width: "20%" }}>status</th>
                                        <th style={{ width: "20%" }}>lock</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td 
                                          style={{opacity:"0.7"}}>John</td>
                                        <td>Smith</td>
                                        <td>fasf</td>
                                        <td>fasf</td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td  style={{opacity:"0.7"}}>Jane</td>
                                        <td>Smith</td>
                                        <td>fasf</td>
                                        <td>fasf</td>

                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td  style={{opacity:"0.7"}}>Jane</td>
                                        <td>Smith</td>
                                        <td>fasf</td>
                                        <td>fasf</td>

                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td  style={{opacity:"0.7"}}>Jane</td>
                                        <td>Smith</td>
                                        <td>fasf</td>
                                        <td>fasf</td>

                                    </tr>








                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={`${style.rolesTable} col-12 col-md-6`}>
                        <div className={`${style.innerTable}`}>

                            <table
                                className={`${style.realTable} table-bordered table-hover `}
                            >
                                <thead>
                                    <tr className="sticky-top">
                                        <th style={{ width: "20%" }}>RoleName</th>
                                        <th style={{ width: "20%" }}>Changed By</th>

                                        <th style={{ width: "20%" }}>lock</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td  style={{opacity:"0.7"}}>John</td>
                                        <td>Smith</td>

                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td  style={{opacity:"0.7"}}>Jane</td>
                                        <td>Smith</td>


                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td  style={{opacity:"0.7"}}>Jane</td>
                                        <td>Smith</td>


                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td  style={{opacity:"0.7"}}>Jane</td>
                                        <td>Smith</td>


                                    </tr>








                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
