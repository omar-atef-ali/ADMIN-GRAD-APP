import React, { useContext, useEffect, useState } from 'react';
import style from "./Invoices.module.css";
import { userContext } from '../../context/userContext';
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaDownload,
  FaDollarSign,
  FaClock,
  FaFileInvoice,
  FaCalendarDay,
  FaCheckCircle,
  FaCalculator
} from "react-icons/fa";
import toast from 'react-hot-toast';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

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

export default function Invoices() {

  const [stats, setStats] = useState({})
  const [invoices, setInvoices] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const [pageSize] = useState(10)

  // Filters & Sorting states
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("")
  const [pageLoading, setPageLoading] = useState(true)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  const navigate = useNavigate();
  const { userToken } = useContext(userContext)

  async function getStats() {
    try {
      const { data } = await api.get("/admin/invoices/statistics", {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
      // console.log(data);
      setStats(data)

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


  async function getInvoices(page = 1, sortCol = sortColumn, sortDir = sortDirection) {
    try{
      if (isFirstLoad) {
        setPageLoading(true);
      }
      const params = {
        PageNumber : page ,
        PageSize : pageSize 
      }
      if (sortCol) {
        params.SortColumn = sortCol;
      }
      if (sortDir) {
        params.SortDirection = sortDir;
      }
      if (search) {
        params.SearchValue = search;
      }
      if (filterType) {
        params.Type = filterType;
      }
      if (filterStatus) {
        params.Status = filterStatus;
      }
      if (startDate) {
        params.DateFrom = startDate;
      }
      if (endDate) {
        if (!startDate || new Date(endDate) >= new Date(startDate)) {
          params.DateTo = endDate;
        }
      }

      const {data} = await api.get("/admin/invoices",{
        headers:{
          Authorization:`Bearer ${userToken}`
        }
        ,
        params: params
      })
      console.log(data);
      setInvoices(data?.items || [])
      setPageNumber(data?.pageNumber || 1)
      setTotalPages(data?.totalPages || 1)
      setHasNextPage(data?.hasNextPage || false)
      setHasPreviousPage(data?.hasPreviousPage || false)
    }catch(error){
      console.log(error);
      toast.error(
        error?.response?.data?.errors?.[1] || "Failed to load Invoices.",
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
        setPageLoading(false);
        setIsFirstLoad(false);
      }
    }
  }

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
    getInvoices(1, column, direction);
  };

  useEffect(() => {
    if (userToken) {
      getStats();
      getInvoices(1, sortColumn, sortDirection);
    }
  }, [userToken, search, filterType, filterStatus, startDate, endDate]);


  async function handleDownloadInvoice(invoiceId) {
    try{
      const {data} = await api.get(`/admin/invoices/${invoiceId}/download`,{
        headers:{
          Authorization:`Bearer ${userToken}`
        }
        ,responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${invoiceId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    }catch(error){
      console.log(error);
      toast.error(
        error?.response?.data?.errors?.[1] || "Failed to download invoice.",
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



  return (
    <>
      {pageLoading && (
        <div className={style.overlay}>
          <div className={style.spinner}></div>
        </div>
      )}
      <div className={style.pageContainer}>
      {/* Header Section */}
      <header className={style.pageHeader}>
        <h1 className={style.pageTitle}>Invoices</h1>
        <p className={style.pageSubtitle}>
          View and audit invoices across all clients
        </p>
      </header>

      {/* Stats Cards Section */}
      <section className={style.statsGrid}>
        <div className={style.statCard}>
          <div className={style.statLabel}>Total Revenue</div>
          <div className={style.statValue}>EGP {stats.totalRevenue}</div>
        </div>

        <div className={style.statCard}>
          <div className={style.statLabel}>This Month Collected</div>
          <div className={style.statValue}>EGP {stats.thisMonthCollected}</div>
        </div>

        <div className={style.statCard}>
          <div className={style.statLabel}>Outstanding</div>
          <div className={style.statValue}>EGP {stats.outstandingAmount}</div>
        </div>

        <div className={style.statCard}>
          <div className={style.statLabel}>Today Invoices</div>
          <div className={style.statValue}>{stats.todayInvoices}</div>
        </div>

        <div className={style.statCard}>
          <div className={style.statLabel}>Paid Invoices</div>
          <div className={style.statValue}>{stats.paidInvoices}</div>
        </div>

        <div className={style.statCard}>
          <div className={style.statLabel}>Avg Invoice Value</div>
          <div className={style.statValue}>EGP {stats.averageInvoiceValue}</div>
        </div>
      </section>

      {/* Middle Widgets Section */}
      <section className={style.middleSection}>
        {/* Revenue Split Widget */}
        <div className={style.widgetCard}>
          <h2 className={style.widgetTitle}>Revenue Split</h2>
          <div className={style.splitList}>
            <div className={style.splitRow}>
              <span className={`${style.splitTag} ${style.initial}`}>Initial</span>
              <span className={style.splitValue}>EGP {stats.initialRevenue}</span>
            </div>
            <div className={style.splitRow}>
              <span className={`${style.splitTag} ${style.renewal}`}>Renewal</span>
              <span className={style.splitValue}>EGP {stats.renewalRevenue}</span>
            </div>
          </div>
        </div>

        {/* Invoice Status Breakdown Widget */}
        <div className={style.widgetCard}>
          <h2 className={style.widgetTitle}>Invoice Status Breakdown</h2>
          <div className={style.breakdownGrid}>
            <div className={style.breakdownRow}>
              <span className={`${style.statusLabelTag} ${style.draft}`}>Draft</span>
              <span className={style.breakdownCount}>{stats.draftInvoices}</span>
            </div>
            <div className={style.breakdownRow}>
              <span className={`${style.statusLabelTag} ${style.open}`}>Open</span>
              <span className={style.breakdownCount}>{stats.openInvoices}</span>
            </div>
            <div className={style.breakdownRow}>
              <span className={`${style.statusLabelTag} ${style.paid}`}>Paid</span>
              <span className={style.breakdownCount}>{stats.paidInvoices}</span>
            </div>
            <div className={style.breakdownRow}>
              <span className={`${style.statusLabelTag} ${style.void}`}>Void</span>
              <span className={style.breakdownCount}>{stats.voidInvoices}</span>
            </div>
            <div className={style.breakdownRow}>
              <span className={`${style.statusLabelTag} ${style.uncollectible}`}>Uncollectible</span>
              <span className={style.breakdownCount}>{stats.uncollectibleInvoices}</span>
            </div>
            <div className={style.breakdownRow}>
              <span className={`${style.statusLabelTag} ${style.overdue}`}>Overdue (Open)</span>
              <span className={style.breakdownCount}>{stats.overdueInvoices}</span>
            </div>
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
              placeholder="Search by ID, client name..."
              className={style.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select 
            className={style.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Initial">Initial</option>
            <option value="Renewal">Renewal</option>
            <option value="AddOn">AddOn</option>
            <option value="Proration">Proration</option>
            <option value="Upgrade">Upgrade</option>
          </select>

          <select 
            className={style.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Open">Open</option>
            <option value="Paid">Paid</option>
            <option value="Void">Void</option>
            <option value="Uncollectible">Uncollectible</option>
          </select>

          <div className={style.dateInputWrapper}>
            <input 
              type="date" 
              className={style.dateInput} 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div className={style.dateInputWrapper}>
            <input 
              type="date" 
              className={style.dateInput} 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          {(search || filterType || filterStatus || startDate || endDate) && (
            <button 
              type="button"
              className={style.clearFilterBtn}
              onClick={() => {
                setSearch("");
                setFilterType("");
                setFilterStatus("");
                setStartDate("");
                setEndDate("");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className={style.rightCount}>
          <span>{invoices?.length || 0} invoices on this page</span>
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className={style.tableCard}>
        <div className={style.tableWrapper}>
          <table className={style.table}>
            <thead>
              <tr>
                <th className={style.th}>Invoice ID</th>
                <th className={style.th}>Client</th>
                <th className={style.th}>Type</th>
                <th className={style.th}>
                  <div className={style.sortingContainer}>
                    Status
                  </div>
                </th>
                <th className={style.th}>
                  <div className={style.sortingContainer}>
                    Total
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "Total" && sortDirection === "ASC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("Total", "ASC")}
                      data-tooltip="Sort ascending"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "Total" && sortDirection === "DESC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("Total", "DESC")}
                      data-tooltip="Sort descending"
                    >
                      ▼
                    </button>
                  </div>
                </th>
                <th className={style.th}>Payments</th>
                <th className={style.th}>
                  <div className={style.sortingContainer}>
                    Created
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "CreatedDate" && sortDirection === "ASC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("CreatedDate", "ASC")}
                      data-tooltip="Sort ascending"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "CreatedDate" && sortDirection === "DESC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("CreatedDate", "DESC")}
                      data-tooltip="Sort descending"
                    >
                      ▼
                    </button>
                  </div>
                </th>
                <th className={style.th}>Subscription ID</th>
                <th className={style.th}>Order</th>
                <th className={style.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              {invoices?.map((invoice) => (
              <tr onClick={()=>{navigate(`/dashboard/invoice-details/${invoice.invoiceId}`)}} key={invoice.invoiceId} className={style.tr}>
                <td className={style.td}>
                  <span className={style.invoiceId}>INV-{invoice.invoiceId}</span>
                </td>
                <td className={style.td}>
                  <span className={style.clientName}>{invoice.clientName}</span>
                </td>
                <td className={style.td}>
                  <span className={`${style.typeBadge} ${
                    invoice.type?.toLowerCase() === "initial" ? style.initial :
                    invoice.type?.toLowerCase() === "renewal" ? style.renewal :
                    invoice.type?.toLowerCase() === "addon" ? style.addon :
                    invoice.type?.toLowerCase() === "proration" ? style.proration :
                    invoice.type?.toLowerCase() === "upgrade" ? style.upgrade :
                    style.initial
                  }`}>{invoice.type}</span>
                </td>
                <td className={style.td}>
                  <span className={`${style.statusBadge} ${
                    invoice.status?.toLowerCase() === "draft" ? style.draft :
                    invoice.status?.toLowerCase() === "open" ? style.open :
                    invoice.status?.toLowerCase() === "paid" ? style.paid :
                    invoice.status?.toLowerCase() === "void" ? style.void :
                    invoice.status?.toLowerCase() === "uncollectible" ? style.uncollectible :
                    invoice.status
                  }`}>{invoice.status}</span>
                </td>
                <td className={style.td}>
                  <span className={style.totalText}>EGP {invoice.total}</span>
                </td>
                <td className={style.td}>
                  <span className={style.paymentsText}>{invoice.numberOfPayments} attempts</span>
                </td>
                <td className={style.td}>
                  <span className={style.dateText}>{formatDate(invoice.createdDate)}</span>
                </td>
                <td className={style.td}>
                  <span className={style.subIdText}>SUB-{invoice.subscriptionId}</span>
                </td>
                <td className={style.td}>
                  <span className={style.orderText}>ORD-{invoice.orderId}</span>
                </td>
                <td className={style.td}>
                  <button
                    className={style.actionBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadInvoice(invoice.invoiceId);
                    }}
                    title="Download"
                  >
                    <FaDownload />
                  </button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <footer className={style.tableFooter}>
          <div className={style.showingText}>
            Showing {invoices?.length > 0 ? (pageNumber - 1) * pageSize + 1 : 0} -{' '}
            {invoices?.length > 0 ? (pageNumber - 1) * pageSize + invoices.length : 0}
          </div>
          <div className={style.pagination}>
            <button 
              className={style.pageBtn} 
              disabled={!hasPreviousPage}
              onClick={() => getInvoices(pageNumber - 1)}
            >
              <FaChevronLeft size={10} />
            </button>
            <span className={style.pageInfo}>Page {pageNumber} of {totalPages}</span>
            <button 
              className={style.pageBtn} 
              disabled={!hasNextPage}
              onClick={() => getInvoices(pageNumber + 1)}
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
