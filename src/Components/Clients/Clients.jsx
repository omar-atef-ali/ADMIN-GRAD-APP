import React, { useContext, useEffect, useState } from "react";
import style from "./Clients.module.css";
import {
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaLock,
  FaCheckCircle,
  FaUserPlus,
  FaSearch,
  FaSlidersH,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaDatabase,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../api";
import { userContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

export default function Clients() {
  const navigate = useNavigate()
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const { userToken } = useContext(userContext);




  async function getStats() {
    try {
      const { data } = await api.get("/Clients/analytics", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      })
      console.log(data);
      setStats(data);

    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.errors?.[1] || "Failed to load Stats.",
        {
          position: "top-center",
          duration: 4000,
          style: {
            background: "linear-gradient(to right, rgba(121, 5, 5, 0.9), rgba(171, 0, 0, 0.85))",
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


  async function getCustomers(page = 1) {
    try {
      setLoading(true);
      const { data } = await api.post("/Clients/search", {
        "pageNumber": page,
        "pageSize": 10
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      })
      console.log(data);
      setCustomers(data.items);
      setPageNumber(data.pageNumber);
      setTotalPages(data.totalPages);
      setHasNextPage(data.hasNextPage);
      setHasPreviousPage(data.hasPreviousPage);

    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.errors?.[1] || "Failed to load Customers.",
        {
          position: "top-center",
          duration: 4000,
          style: {
            background: "linear-gradient(to right, rgba(121, 5, 5, 0.9), rgba(171, 0, 0, 0.85))",
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
      getStats();
      getCustomers(1);
    }
  }, [userToken]);





  return (

    <div className={style.pageContainer}>
      {loading && (
        <div className={style.overlay}>
          <div className={style.spinner}></div>
        </div>
      )}
      {/* Header */}
      <header className={style.pageHeader}>
        <h1 className={style.pageTitle}>Customers</h1>
        <p className={style.pageSubtitle}>
          Manage all customer accounts, subscriptions, and database credentials
        </p>
      </header>

      {/* Stats Section */}
      <section className={style.statsGrid}>

        <div className={style.statCard}>
          <div className={`${style.iconWrapper} ${style.blueIconBg}`}>
            <FaUsers className={style.statIconBlue} />
          </div>
          <div className={style.statInfo}>
            <span className={style.statValue}>{stats.totalUsers}</span>
            <span className={style.statTitle}>Total Customers</span>
          </div>
        </div>
        <div className={style.statCard}>
          <div className={`${style.iconWrapper} ${style.greenIconBg}`}>
            <FaUserCheck className={style.statIconGreen} />
          </div>
          <div className={style.statInfo}>
            <span className={style.statValue}>{stats.activeUsers}</span>
            <span className={style.statTitle}>Active Accounts</span>
          </div>
        </div>
        <div className={style.statCard}>
          <div className={`${style.iconWrapper} ${style.redIconBg}`}>
            <FaUserSlash className={style.statIconRed} />
          </div>
          <div className={style.statInfo}>
            <span className={style.statValue}>{stats.disabledUsers}</span>
            <span className={style.statTitle}>Disabled Accounts</span>
          </div>
        </div>
        <div className={style.statCard}>
          <div className={`${style.iconWrapper} ${style.redIconBg}`}>
            <FaLock className={style.statIconRed} />
          </div>
          <div className={style.statInfo}>
            <span className={style.statValue}>{stats.lockedUsers}</span>
            <span className={style.statTitle}>Locked Accounts</span>
          </div>
        </div>
        <div className={style.statCard}>
          <div className={`${style.iconWrapper} ${style.purpleIconBg}`}>
            <FaCheckCircle className={style.statIconPurple} />
          </div>
          <div className={style.statInfo}>
            <span className={style.statValue}>{stats.activeSubscribers}</span>
            <span className={style.statTitle}>Active Subscribers</span>
          </div>
        </div>
        <div className={style.statCard}>
          <div className={`${style.iconWrapper} ${style.orangeIconBg}`}>
            <FaUserPlus className={style.statIconOrange} />
          </div>
          <div className={style.statInfo}>
            <span className={style.statValue}>{stats.newThisMonth}</span>
            <span className={style.statTitle}>New This Month</span>
          </div>
        </div>

      </section>

      {/* Search & Filters */}
      <section className={style.filterBar}>
        <div className={style.searchContainer}>
          <FaSearch className={style.searchIcon} />
          <input
            type="text"
            placeholder="Search customers..."
            className={style.searchInput}
            disabled
          />
        </div>
        <button className={style.filterButton} disabled>
          <FaSlidersH className={style.filterIcon} />
          <span>Filters</span>
        </button>
      </section>

      {/* Customers Table Section */}
      <section className={style.tableCard}>
        <div className={style.tableContainer}>
          <table className={style.table}>
            <thead>
              <tr>
                <th className={style.th}>
                  <div className={style.thContent}>
                    CUSTOMER <FaChevronUp className={style.sortIcon} />
                  </div>
                </th>
                <th className={style.th}>
                  <div className={style.thContent}>
                    BUSINESS NAME <FaChevronDown className={style.sortIcon} />
                  </div>
                </th>
                <th className={style.th}>
                  <div className={style.thContent}>
                    POSITION <FaChevronDown className={style.sortIcon} />
                  </div>
                </th>
                <th className={style.th}>
                  <div className={style.thContent}>
                    SUBSCRIPTION <FaChevronDown className={style.sortIcon} />
                  </div>
                </th>
                <th className={style.th}>
                  <div className={style.thContent}>
                    ACCOUNT <FaChevronDown className={style.sortIcon} />
                  </div>
                </th>
                <th className={style.th}>
                  <div className={style.thContent}>
                    STATUS <FaChevronDown className={style.sortIcon} />
                  </div>
                </th>
                <th className={style.th}>
                  <div className={style.thContent}>
                    JOIN DATE <FaChevronDown className={style.sortIcon} />
                  </div>
                </th>

                <th className={style.th} style={{ textAlign: "right" }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
             
              {customers?.map((cust) => (
                <tr onClick={() => navigate(`/dashboard/customersview/${cust.id}`)} key={cust.id} className={style.tableRow}>
                  {/* Customer Column */}
                  <td className={style.td}>
                    <div className={style.customerCell}>
                      <div className={style.customerDetails}>
                        <div className={style.customerName}>{cust.firstName} {cust.lastName}</div>
                        <div className={style.customerEmail}>{cust.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Business Name Column */}
                  <td className={style.td}>
                    <div className={style.businessCell}>
                      <div className={style.businessName}>
                        {cust.businessName}
                      </div>
                    </div>
                  </td>

                  {/* Position Column */}
                  <td className={style.td}>
                    <span className={style.positionText}>{cust.position}</span>
                  </td>

                  {/* Subscription Badge */}
                  <td className={style.td}>
                    <span
                      className={`${style.badge} ${cust.hasActiveSubscription ? style.badgeActive
                        : style.badgeExpired
                        }`}
                    >
                      {cust.hasActiveSubscription ? "Active" : "Expired"}
                    </span>
                  </td>

                  {/* Account Badge */}
                  <td className={style.td}>
                    <span
                      className={`${style.badge} ${cust.isLocked ? style.badgeLocked
                        : style.badgeActive
                        }`}
                    >
                      {cust.isLocked && (
                        <FaLock className={style.badgeIcon} />
                      )}
                      {cust.isLocked ? "Locked" : "Active"}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className={style.td}>
                    <span
                      className={`${style.badge} ${cust.isDisabled === false
                        ? style.badgeActive
                        : style.badgeLocked
                        }`}
                    >
                      {cust.isDisabled && (
                        <FaLock className={style.badgeIcon} />
                      )}
                      {cust.isDisabled ? "Disabled" : "Enabled"}
                    </span>
                  </td>

                  {/* Join Date Column */}
                  <td className={style.td}>
                    <span className={style.dateText}>{cust.joinedDate.split('T')[0]}</span>
                  </td>

                  {/* Actions Column */}
                  <td className={style.td} style={{ textAlign: "right" }}>
                    <div className={style.actionsWrapper}>
                      <label className={style.switch}>
                        <input
                          type="checkbox"
                          checked={!cust.isDisabled}

                        />
                        <span className={style.slider}></span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className={style.tableFooter}>
          <span className={style.showingText}>Showing {customers?.length || 0} items on this page</span>
          <div className={style.pagination}>
            <button
              className={style.pageBtn}
              disabled={!hasPreviousPage}
              onClick={() => getCustomers(pageNumber - 1)}
            >
              <FaChevronLeft size={10} />
            </button>
            <span className={style.pageNumber}>Page {pageNumber} of {totalPages}</span>
            <button
              className={style.pageBtn}
              disabled={!hasNextPage}
              onClick={() => getCustomers(pageNumber + 1)}
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
