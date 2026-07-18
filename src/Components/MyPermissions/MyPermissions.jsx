import React, { useContext, useEffect, useState } from "react";
import style from "./MyPermissions.module.css";
import api from "../../api";
import { userContext } from "../../context/userContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function MyPermissions() {
  const { userToken } = useContext(userContext);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  async function fetchPermissions() {
    try {
      setLoading(true);
      const { data } = await api.get(`/Roles/Permissions`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log(data);
      
      setPermissions(data);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.errors[1] || "Failed to fetch permisssions.",
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
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userToken) {
      fetchPermissions();
    }
  }, [userToken]);

  return (
    <>
      {loading && (
        <div className={style.overlay}>
          <div className={style.spinner}></div>
        </div>
      )}
      <div className={style.pageContainer}>
        {/* Breadcrumb Header */}
        <div className={style.headerArea}>
          <div className={style.titleMeta}>
            <h1 className={style.mainTitle}>My Permissions</h1>
          </div>
        </div>

        <div className={style.cardsContainer}>
          <section className={style.detailsCard}>
            <div className={style.cardHeaderRow}>
              <div>
                <h2 className={`${style.cardTitle} totalFont`}>Granted Permissions</h2>
                <p className={style.cardSubtitle}>
                  A list of administrative privileges currently assigned to your account.
                </p>
              </div>
              <span className={style.countBadge}>{permissions.length} Permissions</span>
            </div>

            {permissions.length === 0 && !loading ? (
              <p className={style.noPermissionsText}>No permissions assigned to your user account.</p>
            ) : (
              <div className={style.permissionsTableWrapper}>
                <table className={style.permissionsTable}>
                  <thead>
                    <tr>
                      <th>Permission Name</th>
                      <th>Status</th>
                      <th>Inheritable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm, index) => (
                      <tr key={index}>
                        <td className={style.permNameCell}>
                          <div className={style.iconBadge}>
                            <i className="fa-solid fa-shield-halved"></i>
                          </div>
                          <span className="totalFont" style={{ fontWeight: "500", color: "#1C1814" }}>
                            {perm.name}
                          </span>
                        </td>
                        <td>
                          <span className={`${style.statusBadge} ${style.activeBadge}`}>
                            <span className={style.dot}></span> Enabled
                          </span>
                        </td>
                        <td>
                          <span className={`${style.statusBadge} ${perm.isInheritable ? style.activeBadge : style.inactiveBadge}`}>
                            <span className={style.dot}></span> {perm.isInheritable ? "Yes" : "No"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
