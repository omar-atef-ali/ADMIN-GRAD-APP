import React, { useContext, useEffect, useState } from 'react'
import style from './admin.module.css'
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { userContext } from '../../context/userContext';
import api from '../../api';
export default function Admin() {
    const userId = localStorage.getItem('id')
    const { userToken } = useContext(userContext)
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        activeUsers: 0,
        lockedUsers: 0,
        disabledUsers: 0,
        roleCount: 0,
    });
    const [recentusers, setrecentusers] = useState([]);
    const [recentroles, setrecentroles] = useState([]);

    console.log(userId)
    async function getAnalytics() {
        try {
            const response = await api.get(`/Dashboard/${userId}/analytics`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            })
            console.log(response.data)
            setAnalytics(response.data)
        } catch (error) {
            console.log(error.response?.status, error.response?.data);
        }

    }

    async function getRecentUsers() {
        try {
            const response = await api.get(`/Dashboard/${userId}/recent-users`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            })
            console.log(response.data)
            setrecentusers(response.data)

        } catch (error) {
            console.log(error.response?.status, error.response?.data);
        }

    }
    async function getRecentRoles() {
        try {
            const response = await api.get(`/Dashboard/${userId}/recent-roles`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            })
            console.log(response.data)
            setrecentroles(response.data)

        } catch (error) {
            console.log(error.response?.status, error.response?.data);
        }

    }

    async function handleToggleUser(user) {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to ${user.toggle ? "Unlock" : "Lock"} this user: ${user.email}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, confirm",
            cancelButtonText: "Cancel",
            background: "#1f1f1f",
            color: "#fff",
            confirmButtonColor: "rgb(10, 104, 159)",
            cancelButtonColor: "#646262ff",
            customClass: {
                popup: "custom-popup",
            }

        });

        if (!result.isConfirmed) {
            toast("Operation cancelled — No changes were made", {

                background: "#1f1f1f",
                color: "#fff",
            });
            return;
        }

        try {
            await api.put(
                `/users/${user.id}/toggle-status`,
                {},
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            setrecentusers(prev =>
                prev.map(u =>
                    u.id === user.id ? { ...u, toggle: !u.toggle } : u
                )
            );

            toast.success(
                `${user.email} is now ${!user.toggle ? "Locked" : "Unlocked"}`
            );

        } catch (err) {
            console.log(err);
            toast.error("Error updating user status");
        }
    }



    async function handleToggleRole(role) {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to ${role.toggle ? "Enable" : "Disable"} the role: ${role.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, confirm",
            cancelButtonText: "Cancel",
            background: "#1f1f1f",
            color: "#fff",
            confirmButtonColor: "rgb(10, 104, 159)",
            cancelButtonColor: "#646262ff",
            customClass: {
                popup: "custom-popup",
            }
        });

        if (!result.isConfirmed) {
            toast("Operation cancelled — No changes were made", {
            });
            return;
        }

        try {
            await api.put(
                `/Roles/${role.id}/toggle-status`,
                {},
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            setrecentroles(prev =>
                prev.map(r =>
                    r.id === role.id ? { ...r, toggle: !r.toggle } : r
                )
            );

            toast.success(
                `Role "${role.name}" is now ${!role.toggle ? "Disabled" : "Enabled"}`
            );

        } catch (err) {
            console.log(err);
            toast.error("Error updating role status");
        }
    }



    useEffect(() => {
        if (userId && userToken) {
            getAnalytics();
            getRecentUsers();
            getRecentRoles()
        }
    }, [userId, userToken])

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
                <div className={`row g-md-4 ${style.parentKpis}`}>
                    <div className={`${style.Kpis} col-10 col-md-5 col-lg-2`}>
                        <div className={`${style.KpisInfo}`}>
                            <i className={`${style.kpisIcon} totalFont fa-solid fa-users`}></i>
                            <h5 className="totalFont text-white">+12</h5>
                        </div>
                        <h3 className={`totalFont text-white ${style.count}`}>{analytics.totalUsers}</h3>
                        <h5 className={`totalFont text-white ${style.kpisRole}`}>Total Users</h5>
                    </div>
                    <div className={`${style.Kpis} col-10 col-md-5 col-lg-2`}>
                        <div className={`${style.KpisInfo}`}>
                            <i className={`${style.kpisIcon} totalFont fa-solid fa-chart-line`}></i>
                            <h5 className="totalFont text-white">+8</h5>
                        </div>
                        <h3 className={`totalFont text-white ${style.count}`}>{analytics.activeUsers}</h3>

                        <h5 className={`totalFont text-white ${style.kpisRole}`}>Active Users</h5>

                    </div>
                    <div className={`${style.Kpis} col-10 col-md-5 col-lg-2`}>
                        <div className={`${style.KpisInfo}`}>
                            <i className={`${style.kpisIcon} totalFont  fa-solid fa-shield`}></i>
                            <h5 className="totalFont text-white">+1</h5>
                        </div>
                        <h3 className={`totalFont text-white ${style.count}`}>{analytics.roleCount}</h3>
                        <h5 className={`totalFont text-white ${style.kpisRole}`}>Roles Count</h5>
                    </div>
                    <div className={`${style.Kpis} col-10 col-md-5 col-lg-2`}>
                        <div className={`${style.KpisInfo}`}>
                            <i className={`${style.kpisIcon} totalFont  fa-solid fa-lock `}></i>
                            <h5 className="totalFont text-white">-2</h5>
                        </div>
                        <h3 className={`totalFont text-white ${style.count}`}>{analytics.lockedUsers}</h3>
                        <h5 className={`totalFont text-white ${style.kpisRole}`}>in Active Users</h5>
                    </div>
                    <div className={`${style.Kpis} col-10 col-md-5 col-lg-2`}>
                        <div className={`${style.KpisInfo}`}>
                            <i className={`${style.kpisIcon} totalFont fa-solid fa-ban`}></i>
                            <h5 className="totalFont text-white">-2</h5>
                        </div>
                        <h3 className={`totalFont text-white ${style.count}`}>{analytics.disabledUsers}</h3>
                        <h5 className={`totalFont text-white ${style.kpisRole}`}>Disapled Users</h5>
                    </div>
                </div>
                <div className={`row mt-5 py-4 ${style.bgTable}`}>
                    <div className={`${style.rolesTable} col-12 col-md-12 col-lg-6`}>
                        <div className={`${style.innerTable}`}>
                            <h4 className='totalFont text-white'>Recent Users</h4>
                            <table
                                className={`${style.realTable} table-bordered table-hover `}
                            >
                                <thead>
                                    <tr className="sticky-top">
                                        <th style={{ width: "20%" }}>Name</th>
                                        <th style={{ width: "20%" }}>Email</th>
                                        <th style={{ width: "20%" }}>Status</th>
                                        <th className={`${style.toggleCol}`} style={{ width: "20%" }}>Is Disapled</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {recentusers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>

                                            <td className={`${style.toggleCol2}`} style={{ opacity: "0.7" }}>
                                                {user.email}
                                            </td>


                                            <td>
                                                <button
                                                    disabled={user.status === true}
                                                    onClick={async () => {
                                                        try {

                                                            const result = await Swal.fire({
                                                                title: 'Change Status?',
                                                                text: `Do you want to change status for ${user.email}?`,
                                                                icon: 'question',
                                                                showCancelButton: true,
                                                                confirmButtonText: 'Yes, change',
                                                                cancelButtonText: 'Cancel',
                                                                background: "#1f1f1f",
                                                                color: "#fff",
                                                                confirmButtonColor: "rgb(10, 104, 159)",
                                                                cancelButtonColor: "#646262ff",
                                                            });

                                                            if (!result.isConfirmed) {
                                                                toast("Operation cancelled — No changes were made", {

                                                                });
                                                                return;
                                                            }

                                                            await api.put(
                                                                `/users/${user.id}/unlock`,
                                                                {},
                                                                { headers: { Authorization: `Bearer ${userToken}` } }
                                                            );

                                                            setrecentusers((prev) =>
                                                                prev.map((u) =>
                                                                    u.id === user.id ? { ...u, status: !u.status } : u
                                                                )
                                                            );

                                                            toast.success(
                                                                `${user.email} is now ${!user.status ? "Active" : "InActive"}`
                                                            );

                                                        } catch (err) {
                                                            console.log("Status error:", err);
                                                            toast.error("Error updating user status");
                                                        }
                                                    }}
                                                    className={`${user.status ? style.activebtn : style.inactivebtn} totalFont`}
                                                >
                                                    {user.status ? "Active" : "InActive"}
                                                </button>
                                            </td>



                                            <td>
                                                <button
                                                    onClick={() => handleToggleUser(user)}
                                                    className={`${user.toggle ? style.lockIcon : style.openlockIcon} totalFont`}
                                                >
                                                    {user.toggle ? (
                                                        <i className="fa-solid fa-lock"></i>
                                                    ) : (
                                                        <i className="fa-solid fa-lock-open"></i>
                                                    )}
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>


                            </table>
                        </div>
                    </div>
                    <div className={`${style.rolesTable} col-12 col-md-12 col-lg-6`}>
                        <div className={`${style.innerTable}`}>
                            <h4 className='totalFont text-white'>Recent Role</h4>
                            <table
                                className={`${style.realTable} table-bordered table-hover `}
                            >
                                <thead>
                                    <tr className="sticky-top">
                                        <th style={{ width: "30%" }}>RoleName</th>

                                        <th style={{ width: "30%" }}>Is Disapled</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {recentroles.map((role) => (
                                        <tr key={role.id}>
                                            <td>{role.name}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleToggleRole(role)}
                                                    className={`${role.toggle? style.lockIcon : style.openlockIcon} totalFont`}
                                                >
                                                    {role.toggle? (
                                                        <i className="fa-solid fa-lock"></i>
                                                    ) : (
                                                        <i className="fa-solid fa-lock-open"></i>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
