import React, { useContext, useEffect, useState } from 'react';
import style from './Orders.module.css';
import { FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { userContext } from '../../context/userContext';
import api from '../../api';
import toast from 'react-hot-toast';


export default function Orders() {


   const {userToken} = useContext(userContext)

   const [statistics , setStatistics ]= useState({})
   const [orders , setOrders] = useState([])
   const [pageNumber, setPageNumber] = useState(1)
   const [pageSize, setPageSize] = useState(10)
   const [sortColumn, setSortColumn] = useState('')
   const [sortDirection, setSortDirection] = useState('')
   const [search, setSearch] = useState('')
   const [filterOrderType, setFilterOrderType] = useState('')
   const [filterStatus, setFilterStatus] = useState('')
   const [filterInvoiceStatus, setFilterInvoiceStatus] = useState('')
   const [minPrice, setMinPrice] = useState('')
   const [maxPrice, setMaxPrice] = useState('')
   const [startDate, setStartDate] = useState('')
   const [endDate, setEndDate] = useState('')

   async function getStatistics() {
    try {
      const {data} = await api.get("/admin/orders/statistics", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log(data);
      setStatistics(data)
    } catch (error) {
      console.log(error)
      toast.error(
        error?.response?.data?.errors?.[1] || "Failed to get statistics.",
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

  async function getOrders(page = 1, size = 10, sortCol = sortColumn, sortDir = sortDirection) {
    try {
      const params = {
        PageNumber: page,
        PageSize: size,
      };
      if (sortCol) {
        params.SortColumn = sortCol;
      }
      if (sortDir) {
        params.SortDirection = sortDir;
      }
      if (search) {
        params.SearchValue = search;
      }
      if (filterOrderType) {
        params.OrderType = filterOrderType;
      }
      if (filterStatus) {
        params.Status = filterStatus;
      }
      if (minPrice && maxPrice && Number(maxPrice) < Number(minPrice)) {
        return;
      }
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        return;
      }

      if (minPrice) {
        params.MinTotal = minPrice;
      }
      if (maxPrice) {
        params.MaxTotal = maxPrice;
      }
      if (startDate) {
        params.DateFrom = startDate;
      }
      if (endDate) {
        params.DateTo = endDate;
      }
      const {data} = await api.get("/admin/orders", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: params,
      });
      console.log(data);
      setOrders(data);
      setPageNumber(data.pageNumber || page);
    } catch (error) { 
      console.log(error)
      toast.error(
        error?.response?.data?.errors?.[1] || "Failed to get orders.",
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

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
    getOrders(1, pageSize, column, direction);
  };

  useEffect(() => {
    if (userToken) {
      getStatistics();
      getOrders(1, pageSize, sortColumn, sortDirection);
    }
  }, [userToken, pageSize, search, filterOrderType, filterStatus, minPrice, maxPrice, startDate, endDate]);








  return (
    <div className={style.pageContainer}>
      {/* Header Section */}
      <header className={style.pageHeader}>
        <h1 className={style.pageTitle}>Orders</h1>
        <p className={style.pageSubtitle}>All orders across packages and services.</p>
      </header>

      {/* Stats Section */}
      <section className={style.statsGrid}>
        <div className={style.statCard}>
          <span className={style.statTitle}>Total orders</span>
          <span className={style.statValue}>{statistics?.totalOrders}</span>
        </div>
        <div className={style.statCard}>
          <span className={style.statTitle}>Awaiting payment</span>
          <span className={style.statValue}>{statistics?.awaitingPaymentOrders}</span>
        </div>
        <div className={style.statCard}>
          <span className={style.statTitle}>Refunded</span>
          <span className={style.statValue}>{statistics?.refundedOrders}</span>
        </div>
        <div className={style.statCard}>
          <span className={style.statTitle}>Total revenue</span>
          <span className={style.statValue}>{statistics?.totalRevenue} EGP</span>
        </div>
        <div className={style.statCard}>
          <span className={style.statTitle}>Today revenue</span>
          <span className={style.statValue}>{statistics?.todayRevenue} EGP</span>
        </div>
      </section>

      {/* Filter Bar */}
      <section className={style.filterBar}>
        <div className={style.searchWrapper}>
          <input
            type="text"
            className={style.searchInput}
            placeholder="Search order ID, client name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={style.filterGroup}>
          <select 
            className={style.filterSelect}
            value={filterOrderType}
            onChange={(e) => setFilterOrderType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Package">Package</option>
            <option value="Service">Service</option>
            <option value="AddOn">AddOn</option>
          </select>
          <select 
            className={style.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="AwaitingPayment">AwaitingPayment</option>
            <option value="Paid">Paid</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
          </select>
          <input 
            type="date" 
            className={style.dateInput} 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input 
            type="date" 
            className={style.dateInput} 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <div className={style.priceRange}>
            <input 
              type="number" 
              className={style.priceInput} 
              placeholder="Min EGP" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className={style.priceDash}>-</span>
            <input 
              type="number" 
              className={style.priceInput} 
              placeholder="Max EGP" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className={style.tableCard}>
        <div className={style.tableContainer}>
          <table className={style.table}>
            <thead>
              <tr>
                <th className={style.th}>Order ID</th>
                <th className={style.th}>Client</th>
                <th className={style.th}>Type</th>
                <th className={style.th}>
                  Status
                </th>
                <th className={style.th}>
                  <div className={style.sortingContainer}>
                    Total
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "TotalPrice" && sortDirection === "ASC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("TotalPrice", "ASC")}
                      data-tooltip="Sort ascending"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "TotalPrice" && sortDirection === "DESC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("TotalPrice", "DESC")}
                      data-tooltip="Sort descending"
                    >
                      ▼
                    </button>
                  </div>
                </th>
                <th className={style.th}>
                  <div className={style.sortingContainer}>
                    Date
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "OrderDate" && sortDirection === "ASC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("OrderDate", "ASC")}
                      data-tooltip="Sort ascending"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={`${style.sortBtn} ${sortColumn === "OrderDate" && sortDirection === "DESC" ? style.activeSort : ""} btn p-0 m-0 border-0`}
                      onClick={() => handleSort("OrderDate", "DESC")}
                      data-tooltip="Sort descending"
                    >
                      ▼
                    </button>
                  </div>
                </th>
                <th className={style.th}>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {orders?.items?.map((order) => {
                const isPackage = order.orderType?.toLowerCase() === 'package';
                const typeClass = isPackage ? style.typePackage : style.typeService;

                let statusClass = style.badgeNone;
                const statusLower = order.status?.toLowerCase();
                if (statusLower === 'paid' || statusLower === 'completed') statusClass = style.badgeCompleted;
                else if (statusLower === 'pending') statusClass = style.badgePending;
                else if (statusLower === 'awaitingpayment' || statusLower === 'processing') statusClass = style.badgeProcessing;
                else if (statusLower === 'cancelled') statusClass = style.badgeCancelled;
                else if (statusLower === 'refunded' || statusLower === 'failed') statusClass = style.badgeFailed;

                let invoiceClass = style.invoiceNone;
                const invoiceLower = order.invoiceStatus?.toLowerCase();
                if (invoiceLower === 'issued' || invoiceLower === 'paid') invoiceClass = style.invoiceIssued;
                else if (invoiceLower === 'pending' || invoiceLower === 'unpaid') invoiceClass = style.invoicePending;
                else if (invoiceLower === 'refunded') invoiceClass = style.invoiceRefunded;

                return (
                  <tr key={order.orderId} className={style.tableRow}>
                    <td className={`${style.td} ${style.orderId}`}>o-{order?.orderId}</td>
                    <td className={style.td}>
                      <div className={style.clientDetails}>
                        <span className={style.clientName}>{order?.clientName}</span>
                        <span className={style.clientEmail}>{order?.clientEmail}</span>
                      </div>
                    </td>
                    <td className={style.td}>
                      <span className={`${style.typeBadge} ${typeClass}`}>{order.orderType}</span>
                    </td>
                    <td className={style.td}>
                      <span className={`${style.statusBadge} ${statusClass}`}>{order.status}</span>
                    </td>
                    <td className={`${style.td} ${style.totalText}`}>{order.currency} {order.totalPrice}</td>
                    <td className={`${style.td} ${style.dateText}`}>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className={style.td}>
                      {!order.invoiceStatus || order.invoiceStatus === '-' ? (
                        <span className={style.invoiceDash}>-</span>
                      ) : (
                        <span className={`${style.invoiceBadge} ${invoiceClass}`}>{order.invoiceStatus}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className={style.tableFooter}>
          <span className={style.showingText}>
            Showing {orders?.items?.length > 0 ? (pageNumber - 1) * pageSize + 1 : 0} -{' '}
            {orders?.items?.length > 0 ? (pageNumber - 1) * pageSize + orders.items.length : 0} of{' '}
            {statistics?.totalOrders || 0}
          </span>
          <div className={style.pagination}>
            <span className={style.rowsLabel}>Rows:</span>
            <div className={style.paginationControls}>
              <button
                className={style.pageBtn}
                disabled={!orders?.hasPreviousPage}
                onClick={() => getOrders(pageNumber - 1, pageSize, sortColumn, sortDirection)}
              >
                <FaChevronLeft size={10} />
              </button>
              <span className={style.pageNumber}>
                {orders?.pageNumber || 1} / {orders?.totalPages || 1}
              </span>
              <button
                className={style.pageBtn}
                disabled={!orders?.hasNextPage}
                onClick={() => getOrders(pageNumber + 1, pageSize, sortColumn, sortDirection)}
              >
                <FaChevronRight size={10} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
