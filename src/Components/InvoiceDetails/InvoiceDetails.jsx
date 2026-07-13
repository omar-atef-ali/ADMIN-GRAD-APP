import { useParams, useNavigate } from "react-router-dom";
import api from '../../api';
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiFileText,
  FiDownload,
  FiPackage,
  FiArrowUpRight,
  FiCreditCard,
  FiX,
  FiCheck
} from "react-icons/fi";
import styles from "./InvoiceDetails.module.css";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const Invoiceid = id || '4';

  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState("");

  const handleViewPdf = async () => {
    try {
      setPdfLoading(true);
      const response = await api.get(`/admin/invoices/${Invoiceid}/pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      setPdfBlobUrl(fileURL);
      setShowPdfModal(true);
    } catch (err) {
      console.error("Error fetching PDF:", err);
      alert("Failed to load PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  async function getinvoicedetails() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/admin/invoices/${Invoiceid}`);
      console.log("Invoice API response:", response.data);
      setInvoiceDetails(response.data);
    }
    catch (error) {
      console.error("Error fetching invoice details:", error);
      setError("Failed to load invoice details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getinvoicedetails();
  }, [Invoiceid]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatCurrency = (amount, currency = "EGP") => {
    return `${currency} ${Number(amount || 0).toLocaleString()}`;
  };

  if (loading) {
      return (
        <div className={styles.overlay}>
          <div className={styles.spinner}></div>
        </div>
      );
    }

  if (error || !invoiceDetails) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.errorCard}>
          <p className={styles.errorMessage}>{error || "Invoice not found."}</p>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <FiArrowLeft /> Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  const {
    id: fetchedId,
    type,
    status,
    periodStart,
    periodEnd,
    dueDate,
    currency = "EGP",
    subtotal,
    discountAmount,
    taxAmount,
    total,
    createdAt,
    subscription,
    order,
    lineItems = [],
    payments = []
  } = invoiceDetails;

  const invoiceYear = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
  const formattedInvoiceId = `INV-${invoiceYear}-${String(fetchedId).padStart(3, '0')}`;

  const getStatusBadgeClass = (statusName) => {
    const s = String(statusName || "").toLowerCase();
    if (s === "paid" || s === "completed" || s === "success") {
      return `${styles.badge} ${styles.badgePaid}`;
    }
    if (s === "uncollectible" || s === "failed") {
      return `${styles.badge} ${styles.badgeUncollectible}`;
    }
    return `${styles.badge} ${styles.badgePending}`;
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Top Header Row */}
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <FiArrowLeft className={styles.backIcon} /> Invoices
          </button>
          <span className={styles.headerSeparator}>/</span>
          <span className={styles.headerTitle}>{formattedInvoiceId}</span>
        </div>
        <div className={styles.headerRight}>
          <button onClick={handleViewPdf} className={styles.btnOutline} disabled={pdfLoading}>
            <FiFileText className={styles.btnIcon} /> {pdfLoading ? "Loading..." : "View PDF"}
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className={styles.contentGrid}>
        {/* Row 1 Left: Invoice Summary Card */}
        <section className={`${styles.card} ${styles.summaryCard}`}>
          <h2 className={styles.cardTitle}>Invoice Summary</h2>
          <div className={styles.summaryList}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Invoice ID</span>
              <span className={styles.invoiceIdValue}>{formattedInvoiceId}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Type</span>
              <span className={`${styles.badge} ${styles.badgeType}`}>✦ {type}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Status</span>
              <span className={getStatusBadgeClass(status)}>{status}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Period</span>
              <span className={styles.summaryValue}>
                {formatDate(periodStart)} &rarr; {formatDate(periodEnd)}
              </span>
            </div>
          </div>
        </section>

        {/* Row 1 Right: References Card */}
        <section className={`${styles.card} ${styles.referencesCard}`}>
          <h2 className={styles.cardTitle}>References</h2>
          <div className={styles.referencesWrapper}>
            {/* Subscription Block */}
            <div className={styles.referenceBlock}>
              <span className={styles.refLabel}>SUBSCRIPTION</span>
              {subscription ? (
                <div className={styles.refBox}>
                  <div className={styles.refBoxLeft}>
                    <FiPackage className={styles.refBoxIcon} />
                    <div className={styles.refBoxText}>
                      <span className={styles.refBoxId}>SUB-{String(subscription.id).padStart(3, '0')}</span>
                      <span className={styles.refBoxSubtitle}>{subscription.planType}</span>
                    </div>
                  </div>
                  <FiArrowUpRight className={styles.refArrowIcon} />
                </div>
              ) : (
                <div className={styles.emptyState}>No subscription associated</div>
              )}
            </div>
            <div className={styles.referenceBlock}>
              <span className={styles.refLabel}>ORDER</span>

              {!order ? (
                <div className={styles.emptyState}>No order associated</div>
              ) : order.status === "Renewal" ? (
                <div className={styles.emptyState}>No Order Linked - renewals are generated automatically. </div>
              ) : (
                <div className={styles.refBox}>
                  <div className={styles.refBoxLeft}>
                    <div className={styles.refBoxText}>
                      <span className={styles.refBoxId}>
                        ORD-{String(order.id).padStart(3, "0")}
                      </span>
                      <span className={styles.refBoxSubtitle}>
                        {formatDate(order.orderDate)} &middot;{" "}
                        {String(order.status).toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <FiArrowUpRight className={styles.refArrowIcon} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Row 2: Line Items Card (Full Width) */}
        <section className={`${styles.card} ${styles.lineItemsCard}`}>
          <h2 className={styles.cardTitle}>Line Items</h2>
          <div className={styles.lineItemsWrapper}>
            {lineItems.length > 0 ? (
              <div className={styles.itemsTable}>
                <div className={styles.tableHeader}>
                  <span className={styles.thLeft}>DESCRIPTION</span>
                  <span className={styles.thRight}>AMOUNT</span>
                </div>
                <div className={styles.tableBody}>
                  {lineItems.map((item, idx) => (
                    <div key={idx} className={styles.tableRow}>
                      <span className={styles.itemDesc}>{item.description}</span>
                      <span className={styles.itemAmt}>{formatCurrency(item.amount, currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>No items available for this invoice</div>
            )}

            {lineItems.length > 0 && (
              <div className={styles.totalsWrapper}>
                <div className={styles.totalsRow}>
                  <span className={styles.totalsLabel}>Subtotal</span>
                  <span className={styles.totalsVal}>{formatCurrency(subtotal, currency)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className={styles.totalsRow}>
                    <span className={styles.totalsLabel}>Discount</span>
                    <span className={styles.totalsVal}>-{formatCurrency(discountAmount, currency)}</span>
                  </div>
                )}
                <div className={styles.totalsRow}>
                  <span className={styles.totalsLabel}>Tax</span>
                  <span className={styles.totalsVal}>
                    {taxAmount > 0 ? `+${formatCurrency(taxAmount, currency)}` : formatCurrency(0, currency)}
                  </span>
                </div>
                <div className={`${styles.totalsRow} ${styles.totalGrandRow}`}>
                  <span className={styles.totalGrandLabel}>Total</span>
                  <span className={styles.totalGrandVal}>{formatCurrency(total, currency)}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Row 3: Payment Attempts Card (Full Width) */}
        <section className={`${styles.card} ${styles.paymentsCard}`}>
          <div className={styles.attemptsHeader}>
            Payment Attempts ({payments.length})
          </div>
          <div className={styles.attemptsBody}>
            {payments.length > 0 ? (
              <div className={styles.timelineContainer}>
                <div className={styles.timelineLine}></div>
                {payments.map((payment, index) => {
                  const isFailed = String(payment.status || "").toLowerCase() === "failed" || String(payment.status || "").toLowerCase() === "unpaid";

                  let attemptLabel = "";
                  if (payments.length > 1) {
                    if (index === 0) attemptLabel = "First attempt";
                    else if (index === payments.length - 1) attemptLabel = "Latest attempt";
                  } else if (payments.length === 1) {
                    attemptLabel = "Latest attempt";
                  }

                  return (
                    <div key={payment.id || index} className={styles.timelineRow}>
                      {/* Timeline Circle Node */}
                      <div className={styles.timelineNodeContainer}>
                        <div className={`${styles.timelineNode} ${isFailed ? styles.nodeFailed : styles.nodeCompleted}`}>
                          {isFailed ? (
                            <FiX className={styles.nodeIcon} />
                          ) : (
                            <FiCheck className={styles.nodeIcon} />
                          )}
                        </div>
                      </div>

                      {/* Attempt Detail Card */}
                      <div className={styles.attemptCard}>
                        <div className={styles.attemptCardHeader}>
                          <div className={styles.attemptCardBadgeAndMethod}>
                            <span className={isFailed ? styles.paymentBadgeFailed : styles.paymentBadgeSuccess}>
                              {payment.status}
                            </span>
                            <div className={styles.paymentMethod}>
                              <FiCreditCard className={styles.methodIcon} />
                              <span>{payment.paymentMethod}</span>
                            </div>
                            {attemptLabel && (
                              <span className={styles.attemptAnnotation}>
                                {attemptLabel}
                              </span>
                            )}
                          </div>
                          <div className={styles.attemptAmount}>
                            {formatCurrency(payment.amount, currency)}
                          </div>
                        </div>

                        {/* Metadata row */}
                        <div className={styles.attemptDetailsRow}>
                          <div className={styles.detailCol}>
                            <span className={styles.detailLabel}>Transaction ID</span>
                            <span className={styles.detailVal}>
                              {payment.transactionId || "-"}
                            </span>
                          </div>
                          <div className={styles.detailCol}>
                            <span className={styles.detailLabel}>Attempted</span>
                            <span className={styles.detailVal}>
                              {payment.paidAt ? formatDate(payment.paidAt) : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>No payment attempts recorded</div>
            )}
          </div>
        </section>
      </main>

      {showPdfModal && (
        <div className={styles.modalOverlay} onClick={() => {
          setShowPdfModal(false);
          if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
          setPdfBlobUrl("");
        }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Invoice PDF Preview</h3>
              <div className={styles.modalHeaderActions}>
                {pdfBlobUrl && (
                  <button
                    className={styles.btnOutline}
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = pdfBlobUrl;
                      link.setAttribute('download', `invoice-${Invoiceid}.pdf`);
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    }}
                    title="Download PDF"
                  >
                    <FiDownload /> Download
                  </button>
                )}
                <button className={styles.closeModalBtn} onClick={() => {
                  setShowPdfModal(false);
                  if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
                  setPdfBlobUrl("");
                }}>
                  <FiX />
                </button>
              </div>
            </div>
            <div className={styles.modalBody}>
              {pdfBlobUrl ? (
                <iframe
                  src={pdfBlobUrl}
                  title="Invoice PDF"
                  className={styles.pdfIframe}
                />
              ) : (
                <div className={styles.emptyState}>No PDF loaded</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}