import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import api from '../../api';
import toast from 'react-hot-toast';
import styles from './OrdersDetails.module.css';

export default function OrdersDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const actualId = id || '1';

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/admin/orders/${actualId}`);
        setOrder(response.data);
        console.log(response.data)
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details.");

      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [actualId]);

  const handleCancelOrder = async () => {
    const status = order?.status;

    if (!["pending", "AwaitingPayment"].includes(status)) {
      return;
    }

    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      setLoading(true);
      await api.post(`/admin/orders/${actualId}/cancel`);
      toast.success("Order cancelled successfully");

      const response = await api.get(`/admin/orders/${actualId}`);
      setOrder(response.data);
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerContainer}>
            <div className={styles.headerLeft}>
              <div className={styles.breadcrumb}>
                <Link to="/orders" className={styles.backLink}>
                  <FiArrowLeft /> Orders
                </Link>
                <span className={styles.separator}>/</span>
              </div>
              <div className={styles.titleWrapper}>
                <h1>Error</h1>
                <p className={styles.subtitle}>{error || "Order not found"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const formatCurrency = (amount) => {
    return `EGP ${Number(amount).toLocaleString()}`;
  };

  const formatDate = (dateString, format = 'long') => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (format === 'short') {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === 'paid' || s === 'completed' || s === 'active') {
      return `${styles.badge} ${styles.badgeSuccess}`;
    }
    if (s === 'pending' || s === 'processing') {
      return `${styles.badge} ${styles.badgeWarning}`;
    }
    return `${styles.badge} ${styles.badgeNeutral}`;
  };

  const isPackage = order.orderType === 'Package';
  const isService = order.orderType === 'Service';
  const isAddon = order.orderType === 'AddOn';

  const orderIdDisplay = `ORD-${new Date(order.orderDate).getFullYear()}-${String(order.id).padStart(3, '0')}`;



  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <div className={styles.breadcrumb}>
              <Link to="/orders" className={styles.backLink}>
                <FiArrowLeft /> Orders
              </Link>
              <span className={styles.separator}>/</span>
            </div>
            <div className={styles.titleWrapper}>
              <h1>{orderIdDisplay}</h1>
              <p className={styles.subtitle}>{formatCurrency(order.total)} &middot; {formatDate(order.orderDate)}</p>
            </div>
          </div>
          <button
            className={styles.cancelBtn}
            onClick={handleCancelOrder}
            disabled={
              !["pending", "AwaitingPayment"].includes(order?.status)
            }
          >
            Cancel order
          </button>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.content}>
          {/* Left Column */}
          <div className={styles.leftCol}>
            {/* Purchased Items */}
            {isPackage && order.package && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>Package purchased</div>
                <div className={styles.rowItem}>
                  <div>
                    <div className={styles.itemTitle}>{order.package.name}</div>
                  </div>
                  <div className={styles.price}>{formatCurrency(order.package.price)}</div>
                </div>
              </div>
            )}

            {isService && order.services && order.services.length > 0 && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>Services purchased</div>
                {order.services.map((svc, idx) => (
                  <div key={idx} className={styles.rowItem}>
                    <div>
                      <div className={styles.itemTitle}>{svc.name}</div>
                      <div className={styles.itemDesc}>{svc.durationInDays ? `${svc.durationInDays} Days` : ''}</div>
                    </div>
                    <div className={styles.price}>{formatCurrency(svc.price)}</div>
                  </div>
                ))}
              </div>
            )}

            {isAddon && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>Add-ons purchased</div>
                {(order.addOns && order.addOns.length > 0) ? (
                  order.addOns.map((addon, idx) => (
                    <div key={idx} className={styles.rowItem}>
                      <div>
                        <div className={styles.itemTitle}>{addon.name}</div>
                      </div>
                      <div className={styles.price}>{formatCurrency(addon.price)}</div>
                    </div>
                  ))
                ) : (
                  <div className={styles.rowItem}>
                    <div className={styles.itemTitle}>{order.package?.name || order.services?.[0]?.name || "Add-on Pack"}</div>
                    <div className={styles.price}>{formatCurrency(order.total)}</div>
                  </div>
                )}
              </div>
            )}

            {/* Invoice Info */}
            {/* {order.invoice && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <div>Invoice INV-{new Date(order.orderDate).getFullYear()}-{String(order.invoice.invoiceId).padStart(3, '0')}</div>
                    {order.invoice.periodStart && order.invoice.periodEnd && (
                      <div className={styles.invoiceDates}>
                        {formatDate(order.invoice.periodStart, 'short')} &rarr; {formatDate(order.invoice.periodEnd, 'short')}
                      </div>
                    )}
                  </div>
                  <span className={getStatusBadge(order.invoice.status)}>{order.invoice.status}</span>
                </div>
                <div style={{ padding: '16px 24px', color: '#6b7280', fontSize: '13px', paddingBottom: '0' }}>
                  {isPackage ? 'Package Invoice' : isService ? 'Service Invoice' : 'Invoice'}
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Type</th>
                      <th className={styles.alignRight}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.invoice.lineItems && order.invoice.lineItems.length > 0
                      ? order.invoice.lineItems
                      : (isPackage && order.package)
                        ? [{ description: order.package.name, type: order.invoice.type, amount: order.package.price }]
                        : (isService && order.services)
                          ? order.services.map(s => ({ description: s.name, type: 'Service', amount: s.price }))
                          : [{ description: order.package?.name || "Item", type: order.orderType, amount: order.total }]
                    ).map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.description || item.itemName}</td>
                        <td>{item.itemType || item.type || order.orderType}</td>
                        <td className={`${styles.alignRight} ${styles.price}`}>{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                    <tr className={styles.totalRow}>
                      <td>Total</td>
                      <td></td>
                      <td className={styles.alignRight} style={{ color: '#4f46e5' }}>{formatCurrency(order.invoice.total || order.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )} */}
            {order.invoice ? (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <div>
                      Invoice INV-{new Date(order.orderDate).getFullYear()}-
                      {String(order.invoice.invoiceId).padStart(3, "0")}
                    </div>

                    {order.invoice.periodStart && order.invoice.periodEnd && (
                      <div className={styles.invoiceDates}>
                        {formatDate(order.invoice.periodStart, "short")} &rarr;{" "}
                        {formatDate(order.invoice.periodEnd, "short")}
                      </div>
                    )}
                  </div>

                  <span className={getStatusBadge(order.invoice.status)}>
                    {order.invoice.status}
                  </span>
                </div>

                <div
                  style={{
                    padding: "16px 24px",
                    color: "#6b7280",
                    fontSize: "13px",
                    paddingBottom: "0",
                  }}
                >
                  {
                    isPackage
                      ? "Package Invoice"
                      : isService
                        ? "Service Invoice"
                        : isAddon
                          ? "Add-on Invoice"
                          : "Invoice"
                  }
                </div>

                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Type</th>
                      <th className={styles.alignRight}>Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(order.invoice.lineItems && order.invoice.lineItems.length > 0
                      ? order.invoice.lineItems
                      : isPackage && order.package
                        ? [
                          {
                            description: order.package.name,
                            type: order.invoice.type,
                            amount: order.package.price,
                          },
                        ]
                        : isService && order.services
                          ? order.services.map((s) => ({
                            description: s.name,
                            type: "Service",
                            amount: s.price,
                          }))
                          : [
                            {
                              description: order.package?.name || "Item",
                              type: order.orderType,
                              amount: order.total,
                            },
                          ]
                    ).map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.description || item.itemName}</td>
                        <td>{item.itemType || item.type || order.orderType}</td>
                        <td className={`${styles.alignRight} ${styles.price}`}>
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}

                    <tr className={styles.totalRow}>
                      <td>Total</td>
                      <td></td>
                      <td
                        className={styles.alignRight}
                        style={{ color: "#4f46e5" }}
                      >
                        {formatCurrency(order.invoice.total || order.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.card}>
                <div className={styles.cardHeader}>Invoice</div>

                <div className={styles.cardBody}>
                  <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
                    No invoice available for this order.
                  </p>
                </div>
              </div>
            )}

            {/* Payments */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>Payments</div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th className={styles.alignRight}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {order.payments && order.payments.length > 0 ? (
                    order.payments.map((payment, idx) => (
                      <tr key={idx}>
                        <td style={{ color: '#6b7280' }}>
                          {payment.transactionId ? `TXN-${payment.transactionId}` : `TXN-BT-${idx + 1}`}
                        </td>
                        <td><span className={getStatusBadge(payment.status)}>{payment.status}</span></td>
                        <td className={styles.price}>{formatCurrency(payment.amount)}</td>
                        <td className={styles.alignRight}>{formatDate(payment.createdDate)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: '#6b7280' }}>No payments found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Resulting subscription */}
            {/* {(isAddon || !order.subscription) ? (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  Resulting subscription
                  {order.subscription && (
                    <Link to={`/subscriptions/${order.subscription.subscriptionId}`} className={styles.subscriptionLink}>
                      View full subscription <FiExternalLink />
                    </Link>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>No subscription linked to this order.</p>
                </div>
              </div>
            ) : isPackage ? (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  Resulting subscription
                  <Link to={`/subscriptions/${order.subscription.subscriptionId}`} className={styles.subscriptionLink}>
                    View full subscription <FiExternalLink />
                  </Link>
                </div>
                <div className={styles.cardBody} style={{ padding: '0' }}>
                  <div className={styles.rowItem}>
                    <div className={styles.itemTitle}>{order.package?.name || order.subscription.planType}</div>
                    <span className={getStatusBadge(order.subscription.status)}>{order.subscription.status}</span>
                  </div>
                  <div style={{ padding: '16px 24px', fontSize: '13px', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}>
                    This order generated or contributed to subscription SUB-{new Date(order.subscription.startDate).getFullYear()}-{String(order.subscription.subscriptionId).padStart(3, '0')}.
                  </div>
                </div>
              </div>
            ) : (isService && order.subscription.services) ? (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  Resulting subscription
                  <Link to={`/subscriptions/${order.subscription.subscriptionId}`} className={styles.subscriptionLink}>
                    View full subscription <FiExternalLink />
                  </Link>
                </div>
                <table className={styles.table} style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Start</th>
                      <th>End</th>
                      <th className={styles.alignRight}>Auto-renew</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.subscription.services.map((svc, idx) => (
                      <tr key={idx}>
                        <td className={styles.itemTitle}>{svc.name}</td>
                        <td><span className={getStatusBadge(svc.status)}>{svc.status}</span></td>
                        <td>{formatDate(svc.startDate)}</td>
                        <td>{formatDate(svc.endDate)}</td>
                        <td className={styles.alignRight}>{svc.autoRenew ? 'On' : 'Off'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: '16px 24px', fontSize: '13px', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}>
                  This order generated or contributed to subscription SUB-{new Date(order.subscription.startDate).getFullYear()}-{String(order.subscription.subscriptionId).padStart(3, '0')}.
                </div>
              </div>
            ) : null} */}


            {isAddon ? (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  Resulting subscription

                  {order.subscription && (
                    <Link
                      to={`/subscriptions/${order.subscription.subscriptionId}`}
                      className={styles.subscriptionLink}
                    >
                      View full subscription <FiExternalLink />
                    </Link>
                  )}
                </div>

                <div className={styles.cardBody} style={{ padding: "0" }}>
                  <div className={styles.rowItem}>
                    <div className={styles.itemTitle}>
                      {order.package?.name ||
                        order.services?.[0]?.name ||
                        order.subscription?.planType ||
                        "No Subscription"}
                    </div>

                    {order.subscription && (
                      <span className={getStatusBadge(order.subscription.status)}>
                        {order.subscription.status}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      padding: "16px 24px",
                      fontSize: "13px",
                      color: "#6b7280",
                      borderTop: "1px solid #f3f4f6",
                    }}
                  >
                    {order.subscription
                      ? `This order generated or contributed to subscription SUB-${new Date(
                        order.subscription.startDate
                      ).getFullYear()}-${String(
                        order.subscription.subscriptionId
                      ).padStart(3, "0")}.`
                      : "No subscription linked to this order."}
                  </div>
                </div>
              </div>
            ) : !order.subscription ? (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  Resulting subscription
                </div>

                <div className={styles.cardBody}>
                  <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
                    No subscription linked to this order.
                  </p>
                </div>
              </div>
            ) : isPackage ? (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  Resulting subscription

                  <Link
                    to={`/subscriptions/${order.subscription.subscriptionId}`}
                    className={styles.subscriptionLink}
                  >
                    View full subscription <FiExternalLink />
                  </Link>
                </div>

                <div className={styles.cardBody} style={{ padding: "0" }}>
                  <div className={styles.rowItem}>
                    <div className={styles.itemTitle}>
                      {order.package?.name || order.subscription.planType}
                    </div>

                    <span className={getStatusBadge(order.subscription.status)}>
                      {order.subscription.status}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: "16px 24px",
                      fontSize: "13px",
                      color: "#6b7280",
                      borderTop: "1px solid #f3f4f6",
                    }}
                  >
                    This order generated or contributed to subscription SUB-
                    {new Date(order.subscription.startDate).getFullYear()}-
                    {String(order.subscription.subscriptionId).padStart(3, "0")}.
                  </div>
                </div>
              </div>
            ) : (isService && order.subscription.services) ? (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  Resulting subscription
                  <Link to={`/subscriptions/${order.subscription.subscriptionId}`} className={styles.subscriptionLink}>
                    View full subscription <FiExternalLink />
                  </Link>
                </div>
                <table className={styles.table} style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Start</th>
                      <th>End</th>
                      <th className={styles.alignRight}>Auto-renew</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.subscription.services.map((svc, idx) => (
                      <tr key={idx}>
                        <td className={styles.itemTitle}>{svc.name}</td>
                        <td><span className={getStatusBadge(svc.status)}>{svc.status}</span></td>
                        <td>{formatDate(svc.startDate)}</td>
                        <td>{formatDate(svc.endDate)}</td>
                        <td className={styles.alignRight}>{svc.autoRenew ? 'On' : 'Off'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: '16px 24px', fontSize: '13px', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}>
                  This order generated or contributed to subscription SUB-{new Date(order.subscription.startDate).getFullYear()}-{String(order.subscription.subscriptionId).padStart(3, '0')}.
                </div>
              </div>
            ) : null}

          </div>

          {/* Right Column */}
          <div className={styles.rightCol}>
            {order.client && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>Client</div>
                <div className={styles.cardBody}>
                  <div className={styles.clientInfo}>
                    <div className={styles.avatar}>{getInitials(order.client.name)}</div>
                    <div className={styles.clientDetails}>
                      <h3>{order.client.name}</h3>
                      <p>{order.client.email}</p>
                      {order.client.phone && <p>{order.client.phone}</p>}
                    </div>
                  </div>
                  <Link to={`/customers/${order.client.id}`} className={styles.profileLink}>View customer profile &rarr;</Link>
                </div>
              </div>
            )}

            <div className={styles.card}>
              <div className={styles.cardHeader}>Order summary</div>
              <div className={styles.cardBody}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Order ID</span>
                  <span className={styles.summaryValue} style={{ color: '#4f46e5', fontSize: '13px' }}>{orderIdDisplay}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Date</span>
                  <span className={styles.summaryValue}>{formatDate(order.orderDate)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Type</span>
                  <span className={`${styles.badge} ${styles.badgeType}`}>{order.orderType}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Status</span>
                  <span className={getStatusBadge(order.status)}>{order.status}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Payment</span>
                  <span className={getStatusBadge(order.payments?.[0]?.status )}>{order.payments?.[0].status}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Currency</span>
                  <span className={styles.summaryValue}>{order.currency || 'EGP'}</span>
                </div>
                <div className={styles.totalSummary}>
                  <span>Total</span>
                  <span style={{ color: '#4f46e5' }}>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>Discount applied</div>
              <div className={styles.cardBody}>
                {order.discount ? (
                  <>
                    <div style={{ display: 'inline-block', background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                       {order.discount?.discountCode || "No Code"}
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Discount</span>
                      <span className={styles.summaryValue} style={{ color: '#16a34a' }}>-{formatCurrency(order.discount?.discountAmount)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Original</span>
                      <span className={styles.summaryValue} style={{ color: '#9ca3af', textDecoration: 'line-through' }}>{formatCurrency(order.total + (order.discount?.discountAmount || 0))}</span>
                    </div>
                    <div className={styles.summaryRow} style={{ borderBottom: 'none', paddingBottom: 0, marginTop: '8px', fontWeight: 'bold' }}>
                      <span className={styles.summaryLabel} style={{ color: '#111827', fontWeight: '600' }}>After discount</span>
                      <span className={styles.summaryValue} style={{ color: '#4f46e5' }}>{formatCurrency(order.total)}</span>
                    </div>
                  </>
                ) : (
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>No discount applied to this order.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}