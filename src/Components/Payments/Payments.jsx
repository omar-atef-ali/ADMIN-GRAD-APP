import React, { useContext, useEffect, useState } from 'react';
import style from './Payments.module.css';
import {
  FaSearch,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaWallet,
  FaCreditCard,
  FaCalendarAlt,
  FaBolt
} from 'react-icons/fa';
import { userContext } from '../../context/userContext';
import api from '../../api';
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

export default function Payments() {

  const {userToken} = useContext(userContext);
  const [stats , setStats] = useState({});
  const [payments, setPayments] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [pageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState("All");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  


  async function getStats() {
    try{ 
      const {data} =  await api.get("/admin/payments/statistics" , {
        headers :{
          Authorization: `Bearer ${userToken}`
        }
      })
      console.log(data);
      setStats(data)

    }catch(error){
      console.log(error);
      toast.error(
        error.response?.data?.errors[1] ||
        "Something went wrong while getting payments statistics.",
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
    }
  }

  async function getPayments(page = 1, sortCol = sortColumn, sortDir = sortDirection, searchVal = search, statusF = statusFilter, typeF = invoiceTypeFilter, methodF = paymentMethodFilter, dateFrom = startDate, dateTo = endDate) {
    try{
      if (isFirstLoad) {
        setPageLoading(true);
      }
      const params = {
        PageNumber : page,
        PageSize : pageSize ,
      }
      if (sortCol) {
        params.SortColumn = sortCol;
      }
      if (sortDir) {
        params.SortDirection = sortDir;
      }
      if (searchVal) {
        params.ClientName = searchVal;
      }
      if (statusF && statusF !== "All") {
        params.Status = statusF;
      }
      if (typeF && typeF !== "All") {
        params.InvoiceType = typeF;
      }
      if (methodF && methodF !== "All") {
        params.PaymentMethod = methodF;
      }
      if (dateFrom) {
        params.DateFrom = dateFrom;
      }
      if (dateTo) {
        if (!dateFrom || new Date(dateTo) >= new Date(dateFrom)) {
          params.DateTo = dateTo;
        }
      }
      const {data} = await api.get("/admin/payments" , {
        headers:{
          Authorization: `Bearer ${userToken}`
        },
        params : params
      })
      console.log(data);
      setPayments(data.items || []);
      setPageNumber(data.pageNumber || 1);
      setTotalPages(data.totalPages || 1);
      setHasNextPage(data.hasNextPage || false);
      setHasPreviousPage(data.hasPreviousPage || false);
    }catch(error){
     console.log(error);
      toast.error(
        error.response?.data?.errors[1] ||
        "Something went wrong while getting payments data.",
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
      setPageLoading(false);
      setIsFirstLoad(false);
    }
  }


  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
    getPayments(1, column, direction);
  };

  useEffect(()=>{
    getStats();
    getPayments(1, sortColumn, sortDirection, search, statusFilter, invoiceTypeFilter, paymentMethodFilter, startDate, endDate);
  },[search, statusFilter, invoiceTypeFilter, paymentMethodFilter, startDate, endDate])


  return (
    <>
      {pageLoading && (
        <div className={style.overlay}>
          <div className={style.spinner}></div>
        </div>
      )}
      <div className={style.pageContainer}>
      {/* Header */}
      <header className={style.pageHeader}>
        <h1 className={style.pageTitle}>Payments</h1>
        <p className={style.pageSubtitle}>
          Monitor payment activity, issue refunds, and track revenue
        </p>
      </header>

      {/* Stats Cards Section */}
      <section className={style.statsGrid}>
        <div className={style.statCard}>
          <div className={style.statHeader}>
            <div className={style.statLabel}>Total Payments</div>
          </div>
          <div className={style.statValue}>{stats.totalPayments}</div>
        </div>

        <div className={style.statCard}>
          <div className={style.statHeader}>
            <div className={style.statLabel}>Net Revenue</div>
          </div>
          <div className={style.statValue}>EGP {stats.netRevenue}</div>
        </div>

        <div className={style.statCard}>
          <div className={style.statHeader}>
            <div className={style.statLabel}>Gross Revenue</div>
          </div>
          <div className={style.statValue}>EGP {stats.totalRevenue}</div>
        </div>

        <div className={style.statCard}>
          <div className={style.statHeader}>
            <div className={style.statLabel}>Successful</div>
          </div>
          <div className={style.statValue}>{stats.successfulPayments}</div>
        </div>

        <div className={style.statCard}>
          <div className={style.statHeader}>
            <div className={style.statLabel}>Failed</div>
          </div>
          <div className={`${style.statValue} `}>{stats.failedPayments}</div>
        </div>

        <div className={style.statCard}>
          <div className={style.statHeader}>
            <div className={style.statLabel}>Total Refunded</div>
          </div>
          <div className={style.statValue}>EGP {stats.totalRefundedAmount}</div>
        </div>
      </section>

      {/* Payment Status Breakdown Widget */}
      <section className={style.breakdownWidget}>
        <h2 className={style.widgetTitle}>Payment Status Breakdown</h2>
        <div className={style.breakdownGrid}>
          <div className={style.breakdownItem}>
            <span className={`${style.breakdownBadge} ${style.success}`}>Successful</span>
            <span className={style.breakdownCount}><strong>{stats.successfulPayments}</strong> <span className={style.muted}>of {stats.totalPayments}</span></span>
          </div>
          <div className={style.breakdownItem}>
            <span className={`${style.breakdownBadge} ${style.pending}`}>Pending</span>
            <span className={style.breakdownCount}><strong>{stats.pendingPayments}</strong> <span className={style.muted}>of {stats.totalPayments}</span></span>
          </div>
          <div className={style.breakdownItem}>
            <span className={`${style.breakdownBadge} ${style.failed}`}>Failed</span>
            <span className={style.breakdownCount}><strong>{stats.failedPayments}</strong> <span className={style.muted}>of {stats.totalPayments}</span></span>
          </div>
          <div className={style.breakdownItem}>
            <span className={`${style.breakdownBadge} ${style.refunded}`}>Refunded</span>
            <span className={style.breakdownCount}><strong>{stats.refundedPayments}</strong> <span className={style.muted}>of {stats.totalPayments}</span></span>
          </div>
          <div className={style.breakdownItem}>
            <span className={`${style.breakdownBadge} ${style.partRefunded}`}>Partially Refunded</span>
            <span className={style.breakdownCount}><strong>{stats.partiallyRefundedPayments}</strong> <span className={style.muted}>of {stats.totalPayments}</span></span>
          </div>
        </div>
      </section>

      {/* Filter and Control Bar */}
      <div className={style.controlBar}>
        <div className={style.leftControls}>
          <div className={style.searchWrapper}>
            <FaSearch className={style.searchIcon} />
            <input
              type="text"
              placeholder="Search by client name..."
              className={style.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={style.selectWrapper}>
            <select 
              className={style.filterSelect} 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
              <option value="Processing">Processing</option>
              <option value="Cancelled">Cancelled</option>
              <option value="PartiallyRefunded">Partially Refunded</option>
            </select>
            <FaChevronDown className={style.chevronIcon} />
          </div>

          <div className={style.selectWrapper}>
            <select 
              className={style.filterSelect} 
              value={invoiceTypeFilter}
              onChange={(e) => setInvoiceTypeFilter(e.target.value)}
            >
              <option value="All">Invoice Type</option>
              <option value="Initial">Initial</option>
              <option value="Renewal">Renewal</option>
              <option value="AddOn">AddOn</option>
              <option value="Upgrade">Upgrade</option>
              <option value="Proration">Proration</option>
            </select>
            <FaChevronDown className={style.chevronIcon} />
          </div>

          <div className={style.selectWrapper}>
            <select 
              className={style.filterSelect} 
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <option value="All">Payment Method</option>
              <option value="CreditCard">CreditCard</option>
              <option value="Wallet">Wallet</option>
              <option value="Fawry">Fawry</option>
              <option value="Other">Other</option>
            </select>
            <FaChevronDown className={style.chevronIcon} />
          </div>

          <div className={style.dateInputWrapper}>
            <input 
              type="date" 
              className={style.dateInput} 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="From Date"
            />
          </div>

          <div className={style.dateInputWrapper}>
            <input 
              type="date" 
              className={style.dateInput} 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="To Date"
            />
          </div>

          {(search || statusFilter !== "All" || invoiceTypeFilter !== "All" || paymentMethodFilter !== "All" || startDate || endDate) && (
            <button 
              type="button"
              className={style.clearFilterBtn}
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setInvoiceTypeFilter("All");
                setPaymentMethodFilter("All");
                setStartDate("");
                setEndDate("");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className={style.rightCount}>
          <span>{payments?.length || 0} payments on this page</span>
        </div>
      </div>

      {/* Table Section */}
      <div className={style.tableCard}>
        <div className={style.tableWrapper}>
          <table className={style.table}>
            <thead>
              <tr>
                <th className={style.th}>Payment ID</th>
                <th className={style.th}>Client</th>
                <th className={style.th}>Invoice</th>
                <th className={style.th}>Invoice Type</th>
                <th className={style.th}>Status</th>
                <th className={style.th}>
                  <div className={style.sortingContainer}>
                    Amount
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "Amount" && sortDirection === "ASC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("Amount", "ASC")}
                      data-tooltip="Sort ascending"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "Amount" && sortDirection === "DESC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("Amount", "DESC")}
                      data-tooltip="Sort descending"
                    >
                      ▼
                    </button>
                  </div>
                </th>
                <th className={style.th}>Method</th>
                <th className={style.th}>
                  <div className={style.sortingContainer}>
                    Paid At
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "PaidAt" && sortDirection === "ASC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("PaidAt", "ASC")}
                      data-tooltip="Sort ascending"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "PaidAt" && sortDirection === "DESC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("PaidAt", "DESC")}
                      data-tooltip="Sort descending"
                    >
                      ▼
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr className={style.tr}>
                  <td className={style.td}>
                    <span className={style.paymentId}>PAY-{payment.paymentId}</span>
                  </td>
                  <td className={style.td}>
                    <span className={style.clientName}>{payment.clientName}</span>
                  </td>
                  <td className={style.td}>
                    <span className={style.invoiceNumber}>INV-{payment.invoiceNumber}</span>
                  </td>
                  <td className={style.td}>
                    <span className={`${style.typeBadge} ${
                      payment.invoiceType?.toLowerCase() === "initial" ? style.typeInitial :
                      payment.invoiceType?.toLowerCase() === "renewal" ? style.typeRenewal :
                      payment.invoiceType?.toLowerCase() === "addon" ? style.typeAddon :
                      payment.invoiceType?.toLowerCase() === "upgrade" ? style.typeUpgrade :
                      payment.invoiceType?.toLowerCase() === "proration" ? style.typeProration :
                      style.typeInitial
                    }`}>
                      {payment.invoiceType}
                    </span>
                  </td>
                  <td className={style.td}>
                    <div className={style.statusContainer}>
                      <span className={`${style.statusBadge} ${
                        payment.status?.toLowerCase() === "completed" ? style.statusCompleted :
                        payment.status?.toLowerCase() === "pending" ? style.statusPending :
                        payment.status?.toLowerCase() === "processing" ? style.statusProcessing :
                        payment.status?.toLowerCase() === "failed" ? style.statusFailed :
                        payment.status?.toLowerCase() === "cancelled" ? style.statusCancelled :
                        payment.status?.toLowerCase() === "refunded" ? style.statusRefunded :
                        payment.status?.toLowerCase() === "partiallyrefunded" ? style.statusPartRefunded :
                        style.statusPending
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </td>
                  <td className={style.td}>
                    <span className={style.amountText}>EGP {payment.amount}</span>
                  </td>
                  <td className={style.td}>
                    <div className={style.methodWrapper}>
                      <span>{payment.paymentMethod}</span>
                    </div>
                  </td>
                  <td className={style.td}>
                    <span className={style.dateText}>{formatDate(payment.paidAt)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <footer className={style.tableFooter}>
          <div className={style.showingText}>
            Showing {payments?.length > 0 ? (pageNumber - 1) * pageSize + 1 : 0} -{' '}
            {payments?.length > 0 ? (pageNumber - 1) * pageSize + payments.length : 0}
          </div>
          <div className={style.pagination}>
            <button 
              className={style.pageBtn} 
              disabled={!hasPreviousPage}
              onClick={() => getPayments(pageNumber - 1)}
            >
              <FaChevronLeft size={10} />
            </button>
            <span className={style.pageInfo}>Page {pageNumber} of {totalPages}</span>
            <button 
              className={style.pageBtn} 
              disabled={!hasNextPage}
              onClick={() => getPayments(pageNumber + 1)}
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
}
