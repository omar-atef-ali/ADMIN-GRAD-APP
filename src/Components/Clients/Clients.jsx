import React, { useContext, useEffect, useState, useRef } from "react";
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
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Clients() {
  const navigate = useNavigate()
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const { userToken } = useContext(userContext);

  const [searchText, setSearchText] = useState("");
  const [accountStatus, setAccountStatus] = useState("all");
  const [searchProperties, setSearchProperties] = useState(["Email", "BusinessName", "Position", "UserName"]);
  const [showSearchProps, setShowSearchProps] = useState(false);
  const dropdownRef = useRef(null);

  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSearchProps(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePropertyToggle = (propsToToggle) => {
    setSearchProperties(prev => {
      const hasAll = propsToToggle.every(p => prev.includes(p));
      if (hasAll) {
        return prev.filter(p => !propsToToggle.includes(p));
      } else {
        return [...new Set([...prev, ...propsToToggle])];
      }
    });
  };

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  async function handleToggleStatus(cust) {
    const actionText = cust.isDisabled ? "Enable" : "Disable";
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${actionText} this customer: ${cust.firstName} ${cust.lastName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm",
      cancelButtonText: "Cancel",
      background: "#FAF8F6",
      color: "#1C1814",
      confirmButtonColor: "#4E3074",
      cancelButtonColor: "#8C8581",
      customClass: {
        popup: "custom-popup",
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setLoading(true);
      await api.put(`/Clients/${cust.id}/toggle-status`, {}, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      });

      toast.success(`${cust.firstName} ${cust.lastName} has been ${cust.isDisabled ? "Enabled" : "Disabled"}.`);
      getStats();
      getCustomers(1);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.errors?.[1] || "Failed to update status.",
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

  async function handleUnlock(cust) {
    const result = await Swal.fire({
      title: "Unlock Account?",
      text: `Do you want to unlock this customer's account: ${cust.firstName} ${cust.lastName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, unlock",
      cancelButtonText: "Cancel",
      background: "#FAF8F6",
      color: "#1C1814",
      confirmButtonColor: "#4E3074",
      cancelButtonColor: "#8C8581",
      customClass: {
        popup: "custom-popup",
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setLoading(true);
      await api.put(`/Clients/${cust.id}/unlock`, {}, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      });

      toast.success(`${cust.firstName} ${cust.lastName}'s account has been unlocked successfully.`);
      getStats();
      getCustomers(pageNumber);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.errors?.[1] || "Failed to unlock account.",
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
      if (isFirstLoad) {
        setLoading(true);
      }
      const boolProperties = {};
      if (accountStatus !== "all") {
        boolProperties["IsDisabled"] = accountStatus === "disabled";
      }

      // If only searching in name/username/email, remove spaces. Otherwise keep spaces.
      const onlyNoSpaceFields = searchProperties.length > 0 && searchProperties.every(prop =>
        ["FirstName", "LastName", "UserName", "Email"].includes(prop)
      );
      const searchValue = onlyNoSpaceFields
        ? searchText.replace(/\s+/g, "")
        : searchText.trim();

      const payload = {
        "pageNumber": page,
        "pageSize": 10,
        "searchValue": searchValue,
        "searchProperties": searchProperties.length > 0 ? searchProperties : ["FirstName", "LastName", "Email", "UserName", "BusinessName", "Position"],
        "boolProperties": boolProperties
      };

      if (sortColumn) {
        payload["SortColumn"] = sortColumn;
      }
      if (sortDirection) {
        payload["SortDirection"] = sortDirection;
      }

      const { data } = await api.post("/Clients/search", payload, {
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
      if (isFirstLoad) {
        setLoading(false);
        setIsFirstLoad(false);
      }
    }

  }

  useEffect(() => {
    if (userToken) {
      getStats();
    }
  }, [userToken]);

  useEffect(() => {
    if (userToken) {
      getCustomers(1);
    }
  }, [userToken, accountStatus, searchText, sortColumn, sortDirection]);

  useEffect(() => {
    if (searchText === "" && userToken) {
      getCustomers(1);
    }
  }, [searchText]);

  const handleSearch = (e) => {
    e.preventDefault();
    getCustomers(1);
  };









  return (

    <div className={style.pageContainer}>
      {loading && (
        <div className={style.overlay}>
          <div className={style.spinner}></div>
        </div>
      )}
      {/* Header */}
      <header className={style.pageHeader}>
        <h1 className={style.pageTitle}>Clients</h1>
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
          <div className="d-flex flex-wrap gap-3 align-items-center w-100">
            <form className={`${style.formm} d-flex flex-grow-1`} style={{ minWidth: "280px" }} onSubmit={handleSearch}>
              <div className={style.inputWrapper}>
                <input
                  className={style.searchInput}
                  type="search"
                  placeholder="Search Customers..."
                  aria-label="Search"
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                />
                <FaSearch className={style.inputSearchIcon} onClick={() => getCustomers(1)} />
              </div>

              <div className={style.dropdownContainer} ref={dropdownRef}>
                <button
                  type="button"
                  className={`${style.UserButton} ${style.searchFieldsBtn} totalFont`}
                  onClick={() => setShowSearchProps(!showSearchProps)}
                >
                  Search In <FaChevronDown size={10} style={{ marginLeft: "6px" }} />
                </button>

                {showSearchProps && (
                  <div className={style.searchPropsDropdown}>
                    <label className={style.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={searchProperties.includes("UserName")}
                        onChange={() => handlePropertyToggle(["UserName"])}
                        className={style.checkboxInput}
                      />
                      <span>Customer Name</span>
                    </label>
                    <label className={style.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={searchProperties.includes("Email")}
                        onChange={() => handlePropertyToggle(["Email"])}
                        className={style.checkboxInput}
                      />
                      <span>Email Address</span>
                    </label>
                    <label className={style.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={searchProperties.includes("BusinessName")}
                        onChange={() => handlePropertyToggle(["BusinessName"])}
                        className={style.checkboxInput}
                      />
                      <span>Business Name</span>
                    </label>
                    <label className={style.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={searchProperties.includes("Position")}
                        onChange={() => handlePropertyToggle(["Position"])}
                        className={style.checkboxInput}
                      />
                      <span>Position</span>
                    </label>
                  </div>
                )}
              </div>
            </form>

            <div className={style.selection}>
              <select
                value={accountStatus}
                onChange={(e) => setAccountStatus(e.target.value)}
                className={style.filterSelect}
              >
                <option value="all">All Statuses</option>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Customers Table Section */}
      <section className={style.tableCard}>
        <div className={style.tableContainer}>
          <table className={style.table}>
            <thead>
              <tr>
                <th className={style.th}>
                  <div className={style.sortingContainer}>
                    CUSTOMER
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "UserName" && sortDirection === "ASC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("UserName", "ASC")}
                      data-tooltip="Sort ascending"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "UserName" && sortDirection === "DESC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("UserName", "DESC")}
                      data-tooltip="Sort descending"
                    >
                      ▼
                    </button>
                  </div>
                </th>
                <th className={style.th}>
                  <div className={style.sortingContainer}>
                    BUSINESS NAME
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "BusinessName" && sortDirection === "ASC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("BusinessName", "ASC")}
                      data-tooltip="Sort ascending"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "BusinessName" && sortDirection === "DESC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("BusinessName", "DESC")}
                      data-tooltip="Sort descending"
                    >
                      ▼
                    </button>
                  </div>
                </th>
                <th className={style.th}>
                  <div className={style.sortingContainer}>
                    POSITION
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "Position" && sortDirection === "ASC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("Position", "ASC")}
                      data-tooltip="Sort ascending"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "Position" && sortDirection === "DESC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("Position", "DESC")}
                      data-tooltip="Sort descending"
                    >
                      ▼
                    </button>
                  </div>
                </th>
                <th className={style.th}>
                  SUBSCRIPTION
                </th>
                <th className={style.th}>
                  ACCOUNT
                </th>
                <th className={style.th}>
                  STATUS
                </th>
                <th className={style.th}>
                  <div className={style.sortingContainer}>
                    JOIN DATE
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "JoinedDate" && sortDirection === "ASC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("JoinedDate", "ASC")}
                      data-tooltip="Sort ascending"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "JoinedDate" && sortDirection === "DESC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("JoinedDate", "DESC")}
                      data-tooltip="Sort descending"
                    >
                      ▼
                    </button>
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
                    {cust.isLocked ? (
                      <button
                        type="button"
                        className={`${style.badge} ${style.badgeLocked} ${style.clickableBadge}`}
                        onClick={() => handleUnlock(cust)}
                        title="Click to unlock account"
                      >
                        <FaLock className={style.badgeIcon} /> Locked
                      </button>
                    ) : (
                      <span className={`${style.badge} ${style.badgeActive}`}>
                        Active
                      </span>
                    )}
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
                          onChange={() => handleToggleStatus(cust)}
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
