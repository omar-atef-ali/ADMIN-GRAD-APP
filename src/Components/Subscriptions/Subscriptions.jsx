import React, { useContext, useEffect, useState } from 'react';
import style from "./Subscriptions.module.css";
import {
  FaSearch,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaSync,
  FaSlidersH
} from "react-icons/fa";
import { userContext } from "../../context/userContext";
import api from "../../api";
import toast from 'react-hot-toast';

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

const getAvatarColor = (name) => {
  const colors = ["#4E3074", "#2B1B4D", "#3A2A56", "#463066", "#2C204B", "#3A225E", "#433A5E", "#3D275A", "#211D3C", "#2B1D3D"];
  if (!name) return colors[0];
  const charCode = name.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
};

const isWarningDate = (dateString, status) => {
  if (!dateString || status !== "Active") return false;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 30;
};
export default function Subscriptions() {
  const { userToken } = useContext(userContext);
  const [subscription, setSubscription] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  async function getSubscriptions(page = 1) {
    try {
      const payload = {
        "pageNumber": page,
        "pageSize": 10,
        // "sortColumn": "string",
        // "sortDirection": "string",
        "searchValue": "CustomerName",
        "searchProperties": [
          "Sara"
        ],
        // "planType": "StandardPackage",
        // "status": "Active",
        // "autoRenew": true,
        // "endDate": "2026-07-05T14:04:20.515Z"
      };
      const { data } = await api.post('/ClientSubscriptions/search', payload, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      console.log(data);
      setSubscription(data.items || []);
      setPageNumber(data.pageNumber || 1);
      setTotalPages(data.totalPages || 1);
      setHasNextPage(data.hasNextPage || false);
      setHasPreviousPage(data.hasPreviousPage || false);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.errors?.[1] ||
        "Something went wrong .",
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
            height: "100%",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
          },
          iconTheme: {
            primary: "#FF4D4F",
            secondary: "#ffffff",
          },
        },
      );
    }
  }

  useEffect(() => {
    if (userToken) {
      getSubscriptions(1);
    }
  }, [userToken]);
  // Static state variables for input controls (no handlers/functions as requested)
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className={style.pageContainer}>
      {/* Header Section */}
      <header className={style.pageHeader}>
        <h1 className={style.pageTitle}>Subscriptions</h1>
        <p className={style.pageSubtitle}>
          Monitor and manage all customer subscriptions
        </p>
      </header>

      {/* Control Bar */}
      <div className={style.controlBar}>
        <div className={style.leftControls}>
          {/* Search Input wrapper */}
          <div className={style.searchWrapper}>
            <FaSearch className={style.searchIcon} />
            <input
              type="text"
              placeholder="Search by ID, name or email..."
              className={style.searchInput}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <button type="button" className={style.filterPill}>
            All Types <FaChevronDown className={style.arrowIcon} />
          </button>

          <button type="button" className={style.filterPill}>
            All Status <FaChevronDown className={style.arrowIcon} />
          </button>

          <button type="button" className={style.filterPill}>
            Auto Renew <FaChevronDown className={style.arrowIcon} />
          </button>

          <button type="button" className={style.filterPill}>
            <FaSlidersH className={style.sliderIcon} /> End Date
          </button>
        </div>

        {/* Counter */}
        <div className={style.rightCount}>
          <span>{subscription.length} subscriptions</span>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className={style.tableCard}>
        <div className={style.tableWrapper}>
          <table className={style.table}>
            <thead>
              <tr>
                <th className={style.th}>Subscription ID</th>
                <th className={style.th}>Customer</th>
                <th className={style.th}>Plan Type</th>
                <th className={style.th}>Current Plan</th>
                <th className={style.th}>Status</th>
                <th className={style.th}>Auto Renew</th>
                <th className={style.th}>End Date</th>
                <th className={style.th}>Created</th>
                {/* <th className={style.th} style={{ textAlign: 'right' }}>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {subscription.map((sub) => (
                <tr key={sub.subscriptionId} className={style.tr}>
                  {/* Subscription ID */}
                  <td className={style.td}>
                    <span className={style.subId}>SUB-{sub.subscriptionId}</span>
                  </td>

                  {/* Customer (Avatar initials + Name & Company) */}
                  <td className={style.td}>
                    <div className={style.customerCell}>
                      <div className={style.customerDetails}>
                        <span className={style.customerName}>{sub.customerName}</span>
                        <span className={style.customerCompany}>{sub.customerEmail}</span>
                      </div>
                    </div>
                  </td>

                  {/* Plan Type Badge */}
                  <td className={style.td}>
                    <span
                      className={`${style.badge} ${sub.planType === 'StandardPackage' ? style.badgeStandard : style.badgeCustomized
                        }`}
                    >
                      {sub.planType === 'StandardPackage' ? 'Standard' : 'Customized'}
                    </span>
                  </td>

                  {/* Current Plan */}
                  <td className={style.td}>
                    <span className={style.planText}>{sub.currentPlan}</span>
                  </td>

                  {/* Status Badge */}
                  <td className={style.td}>
                    <span
                      className={`${style.badge} ${sub.status === 'Active'
                        ? style.statusActive
                        : sub.status === 'Expired'
                          ? style.statusExpired
                          : sub.status === 'Terminated'
                            ? style.statusTerminated
                            : style.statusCancelled
                        }`}
                    >
                      {sub.status}
                    </span>
                  </td>

                  {/* Auto Renew Badge */}
                  <td className={style.td}>
                    {sub.autoRenew ? (
                      <span className={`${style.badge} ${style.renewEnabled}`}>
                        <FaSync className={style.syncIcon} /> Enabled
                      </span>
                    ) : (
                      <span className={`${style.badge} ${style.renewDisabled}`}>
                        Disabled
                      </span>
                    )}
                  </td>

                  {/* End Date */}
                  <td className={style.td}>
                    <span
                      className={`${style.dateText} ${isWarningDate(sub.endDate, sub.status) ? style.warningText : ''}`}
                    >
                      {formatDate(sub.endDate)}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className={style.td}>
                    <span className={style.createdText}>{formatDate(sub.createdDate)}</span>
                  </td>

                  {/* Actions Column
                  <td className={style.td} style={{ textAlign: 'right' }}>
                    <button type="button" className={style.actionBtn} title="View Details">
                      <FaEye />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <footer className={style.tableFooter}>
          <div className={style.showingText}>
            Showing {subscription.length > 0 ? (pageNumber - 1) * 10 + 1 : 0}–{(pageNumber - 1) * 10 + subscription.length} items
          </div>
          <div className={style.pagination}>
            <button
              type="button"
              className={style.pageBtn}
              disabled={!hasPreviousPage}
              onClick={() => getSubscriptions(pageNumber - 1)}
            >
              <FaChevronLeft size={10} />
            </button>
            <span className={style.pageInfo}>Page {pageNumber} of {totalPages}</span>
            <button
              type="button"
              className={style.pageBtn}
              disabled={!hasNextPage}
              onClick={() => getSubscriptions(pageNumber + 1)}
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
