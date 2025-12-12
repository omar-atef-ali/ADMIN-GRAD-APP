import React, { useContext, useEffect, useState } from "react";
import style from "./admin.module.css";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { userContext } from "../../context/userContext";
import api from "../../api";
import { data, Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Treemap,
  ResponsiveContainer,
} from "recharts";

export default function Admin({ users = [], roles = [] }) {
  const userId = localStorage.getItem("id");
  const { userToken } = useContext(userContext);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    lockedUsers: 0,
    disabledUsers: 0,
    roleCount: 0,
  });
  const [recentusers, setrecentusers] = useState([]);
  const [recentroles, setrecentroles] = useState([]);
  const [chartAllUsers, setChartAllUsers] = useState([]);
  const [chartAllRoles, setChartAllRoles] = useState([]);
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const pendingUsers = users.filter((u) => u.status === "Pending").length;
  const totalRoles = roles.length;

  // console.log(userId)
  async function getAnalytics() {
    try {
      const response = await api.get(`/Dashboard/analytics`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      // console.log(response.data)
      setAnalytics(response.data);
    } catch (error) {
      console.log(error.response?.status, error.response?.data);
    }
  }

  /////////////////////////////////////////////////////////////////////

  const total = analytics.totalUsers || 1;
  const chartData = [
    { name: "Active", value: (analytics.activeUsers / total) * 100 },
    { name: "InActive", value: (analytics.lockedUsers / total) * 100 },
    { name: "Disabled", value: (analytics.disabledUsers / total) * 100 },
  ];
  const COLORS = ["#4a90e2", "#f5a623", "#7ed321"]; // نفس ألوان الشارت اللي طلّعتها

  async function getAllUsers() {
    try {
      const { data } = await api.post(`/users/search`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setChartAllUsers(data.items);
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
    }
  }

  async function getAllRoles() {
    try {
      const { data } = await api.post(
        `/Roles/search?includeDisabledRoles=true`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setChartAllRoles(data.items);
      console.log(data.items);
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
    }
  }

  const roleCounts = {};

  chartAllUsers.forEach((u) => {
    const roleName = u.role || "Unknown";
    roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
  });

  const COLORS2 = {
    false: "#4CAF50", // Enabled
    true: "#b63228ff", // Disabled
  };

  const RoleChartData = chartAllRoles.map((r) => ({
    name: r.name,
    size: roleCounts[r.name] || 0,
    fill: COLORS2[r.isDisabled],
  }));

  useEffect(() => {
    getAllUsers();
    getAllRoles();
  }, [userToken]);

  ////////////////////////////////////////////////////////////////////////////

  async function getRecentUsers() {
    try {
      const response = await api.get(`/Dashboard/recent-users`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      // console.log(response.data)
      setrecentusers(response.data);
    } catch (error) {
      console.log(error.response?.status, error.response?.data);
    }
  }
  async function getRecentRoles() {
    try {
      const response = await api.get(`/Dashboard/recent-roles`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      // console.log(response.data)
      setrecentroles(response.data);
    } catch (error) {
      console.log(error.response?.status, error.response?.data);
    }
  }

  // async function handleToggleUser(user) {
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: `Do you want to ${user.toggle ? "Unlock" : "Lock"} this user: ${
  //       user.email
  //     }?`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, confirm",
  //     cancelButtonText: "Cancel",
  //     background: "#1f1f1f",
  //     color: "#fff",
  //     confirmButtonColor: "rgb(10, 104, 159)",
  //     cancelButtonColor: "#646262ff",
  //     customClass: {
  //       popup: "custom-popup",
  //     },
  //   });

  //   if (!result.isConfirmed) {
  //     toast("Operation cancelled — No changes were made", {
  //       background: "#1f1f1f",
  //       color: "#fff",
  //     });
  //     return;
  //   }

  //   try {
  //     await api.put(
  //       `/users/${user.id}/toggle-status`,
  //       {},
  //       { headers: { Authorization: `Bearer ${userToken}` } }
  //     );

  //     setrecentusers((prev) =>
  //       prev.map((u) => (u.id === user.id ? { ...u, toggle: !u.toggle } : u))
  //     );

  //     toast.success(
  //       `${user.email} is now ${!user.toggle ? "Locked" : "Unlocked"}`
  //     );
  //     getAnalytics()

  //   } catch (err) {
  //     console.log(err);
  //     toast.error("Error updating user status");
  //   }
  // }

  // async function handleToggleRole(role) {
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: `Do you want to ${role.toggle ? "Enable" : "Disable"} the role: ${
  //       role.name
  //     }?`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, confirm",
  //     cancelButtonText: "Cancel",
  //     background: "#1f1f1f",
  //     color: "#fff",
  //     confirmButtonColor: "rgb(10, 104, 159)",
  //     cancelButtonColor: "#646262ff",
  //     customClass: {
  //       popup: "custom-popup",
  //     },
  //   });

  //   if (!result.isConfirmed) {
  //     toast("Operation cancelled — No changes were made", {});
  //     return;
  //   }

  //   try {
  //     await api.put(
  //       `/Roles/${role.id}/toggle-status`,
  //       {},
  //       { headers: { Authorization: `Bearer ${userToken}` } }
  //     );

  //     setrecentroles((prev) =>
  //       prev.map((r) => (r.id === role.id ? { ...r, toggle: !r.toggle } : r))
  //     );

  //     toast.success(
  //       `Role "${role.name}" is now ${!role.toggle ? "Disabled" : "Enabled"}`
  //     );
  //     getAnalytics()
  //   } catch (err) {
  //     console.log(err);
  //     toast.error("Error updating role status");
  //   }
  // }

  useEffect(() => {
    if (userId && userToken) {
      getAnalytics();
      getRecentUsers();
      getRecentRoles();
    }
  }, [userId, userToken]);

  return (
    <>
      <div className={`container-fluid ${style.AdminBody}`}>
        <div className={`${style.parent_Admin}`}>
          <h1
            className={`${style.adminTilte} totalFont`}
            style={{
              color: "white",
              fontSize: "2.25rem",
              lineHeight: "1.2",
              background: "linear-gradient(to right, white, #bcbcbcff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Dashboard
          </h1>
          <div className={`row g-md-4 ${style.parentKpis}`}>
            <div className={`${style.Kpis} col-10 col-md-5 col-lg-2`}>
              <div className={`${style.KpisInfo}`}>
                <i
                  className={`${style.kpisIcon} totalFont fa-solid fa-users`}
                ></i>
              </div>
              <h3 className={`totalFont text-white ${style.count}`}>
                {analytics.totalUsers}
              </h3>
              <h5 className={`totalFont text-white ${style.kpisRole}`}>
                Total Users
              </h5>
            </div>
            <div className={`${style.Kpis} col-10 col-md-5 col-lg-2`}>
              <div className={`${style.KpisInfo}`}>
                <i
                  className={`${style.kpisIcon} totalFont fa-solid fa-chart-line`}
                ></i>
              </div>
              <h3 className={`totalFont text-white ${style.count}`}>
                {analytics.activeUsers}
              </h3>

              <h5 className={`totalFont text-white ${style.kpisRole}`}>
                Active Users
              </h5>
            </div>

            <div className={`${style.Kpis} col-10 col-md-5 col-lg-2`}>
              <div className={`${style.KpisInfo}`}>
                <i
                  className={`${style.kpisIcon} totalFont  fa-solid fa-lock `}
                ></i>
              </div>
              <h3 className={`totalFont text-white ${style.count}`}>
                {analytics.lockedUsers}
              </h3>
              <h5 className={`totalFont text-white ${style.kpisRole}`}>
                InActive Users
              </h5>
            </div>
            <div className={`${style.Kpis} col-10 col-md-5 col-lg-2`}>
              <div className={`${style.KpisInfo}`}>
                <i
                  className={`${style.kpisIcon} totalFont fa-solid fa-ban`}
                ></i>
              </div>
              <h3 className={`totalFont text-white ${style.count}`}>
                {analytics.disabledUsers}
              </h3>
              <h5 className={`totalFont text-white ${style.kpisRole}`}>
                Disapled Users
              </h5>
            </div>
            <div className={`${style.Kpis} col-10 col-md-5 col-lg-2`}>
              <div className={`${style.KpisInfo}`}>
                <i
                  className={`${style.kpisIcon} totalFont  fa-solid fa-shield`}
                ></i>
              </div>
              <h3 className={`totalFont text-white ${style.count}`}>
                {analytics.roleCount}
              </h3>
              <h5 className={`totalFont text-white ${style.kpisRole}`}>
                Roles Count
              </h5>
            </div>
          </div>
          <div className="row  py-4 g-4">
            {/* User Status Distribution */}
            <div className="col-12 col-lg-6">
              <div className={`${style.card} shadow-sm`}>
                <div className={style.cardBody}>
                  <h5 className={style.cardTitle}>User Status Distribution</h5>
                  <p className=" text-white-50 mb-3">
                    Percentage of users by status
                  </p>
                  <PieChart width={500} height={350}>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent,
                        index,
                        name,
                      }) => {
                        const RADIAN = Math.PI / 175;
                        const radius =
                          outerRadius + (window.innerWidth < 768 ? 37 : 55); // المسافة عن الدائرة
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        const fontSize = window.innerWidth < 768 ? 10 : 15; // حجم الخط للموبايل أصغر
                        return (
                          <text
                            x={x}
                            y={y}
                            fontSize={fontSize}
                            fill={COLORS[index]}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {`${name}: ${(percent * 100).toFixed(1)}%`}
                          </text>
                        );
                      }}
                      labelLine={false}
                    >
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v.toFixed(1)}%`} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </div>
              </div>
            </div>

            {/* User Status Distribution */}
            <div className="col-12 col-lg-6">
              <div className={`${style.card} shadow-sm`}>
                <div className={style.cardBody}>
                  {/* خلفية داكنة */}
                  <h5
                    className={style.cardTitle}
                    style={{
                      color: "#fff",
                      fontSize: window.innerWidth < 768 ? 16 : 20,
                    }}
                  >
                    Roles Distribution
                  </h5>
                  <p
                    className="mb-3 text-white-50"
                    style={{ fontSize: window.innerWidth < 768 ? 12 : 14 }}
                  >
                    User count per role
                  </p>

                  <div
                    style={{
                      width: "100%",
                      height: window.innerWidth < 768 ? 400 : 325,
                    }}
                  >
                    {RoleChartData.length === 0 ? (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "#fff",
                        }}
                      >
                        {/* ممكن تحط رسالة loading هنا */}
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                          data={RoleChartData}
                          dataKey="size"
                          stroke="none"
                          animationDuration={400}
                          aspectRatio={window.innerWidth < 768 ? 1 : 4 / 3}
                          content={(props) => {
                            const { x, y, width, height, name, size, fill } =
                              props;

                            const minWidth = window.innerWidth < 768 ? 20 : 30;
                            const minHeight = window.innerWidth < 768 ? 15 : 20;

                            if (width < minWidth || height < minHeight)
                              return null;

                            const padding = 4;
                            const total = RoleChartData.reduce(
                              (sum, r) => sum + r.size,
                              0
                            );
                            const percent =
                              total > 0 ? ((size / total) * 100).toFixed(1) : 0;

                            return (
                              <g>
                                <rect
                                  x={x + padding / 2}
                                  y={y + padding / 2}
                                  width={width - padding}
                                  height={height - padding}
                                  fill={fill}
                                />
                                {width > 50 && height > 30 && (
                                  <text
                                    x={x + width / 2}
                                    y={y + height / 2}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#fff"
                                    fontSize={window.innerWidth < 768 ? 10 : 12}
                                    fontWeight="500"
                                  >
                                    {name} ({percent}%)
                                  </text>
                                )}
                              </g>
                            );
                          }}
                        >
                          <Tooltip
                            formatter={(value, name, props) => [
                              `${value} users`,
                              props.payload.name,
                            ]}
                          />
                        </Treemap>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Legend لتوضيح كل لون */}
                  <div
                    className="mt-2 d-flex align-items-center"
                    style={{ flexWrap: "wrap" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: 16,
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 10,
                          backgroundColor: "#b63228",
                          marginRight: 6,
                        }}
                      ></div>
                      <span
                        style={{
                          fontSize: window.innerWidth < 768 ? 10 : 12,
                          color: "#e24d42ff",
                        }}
                      >
                        Disabled
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 10,
                          backgroundColor: "#4CAF50",
                          marginRight: 6,
                        }}
                      ></div>
                      <span
                        style={{
                          fontSize: window.innerWidth < 768 ? 10 : 12,
                          color: "#4CAF50",
                        }}
                      >
                        Enabled
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
