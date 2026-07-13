import { useEffect, useState } from "react";
import api from "../../api";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiExternalLink, FiRotateCcw, FiCheck } from "react-icons/fi";
import styles from "./PaymentDetails.module.css";

export default function PaymentDetails() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [Payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const actualId = id || searchParams.get("id") || "36";

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get(`/admin/payments/${actualId}`);
                setPayment(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching payment details:", error);
                const errorMsg = error.response?.data?.errors?.[1] ||
                    error.response?.data?.message ||
                    "Something went wrong fetching payment details.";
                
                setError(errorMsg);
                
                toast.error(errorMsg, {
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
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                    },
                    iconTheme: {
                        primary: "#FF4D4F",
                        secondary: "#ffffff",
                    },
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPayment();
    }, [actualId]);

    
    const formatDateTime = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "—";
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    };

    const formatCurrency = (amount, currency = "EGP") => {
        if (amount === undefined || amount === null) return "—";
        return `${currency} ${Number(amount).toLocaleString()}`;
    };

    const getStatusBadgeClass = (statusName) => {
        const s = String(statusName || "").toLowerCase();
        if (s === "partiallyrefunded") {
            return `${styles.badge} ${styles.badgePartiallyRefunded}`;
        }
        if (s === "paid" || s === "completed" || s === "success") {
            return `${styles.badge} ${styles.badgePaid}`;
        }
        if (s === "failed" || s === "refunded") {
            return `${styles.badge} ${styles.badgeFailed}`;
        }
        return `${styles.badge} ${styles.badgePending}`;
    };

    const formatStatusLabel = (statusName) => {
        if (!statusName) return "—";
        if (String(statusName).toLowerCase() === "partiallyrefunded") {
            return "Partially Refunded";
        }
        return statusName;
    };

    const formatPaymentMethod = (method) => {
        if (!method) return "—";
        if (method === "CreditCard") return "Credit Card";
        if (method === "BankTransfer") return "Bank Transfer";
        return method;
    };

    if (loading) {
        return (
          <div className={styles.overlay}>
            <div className={styles.spinner}></div>
          </div>
        );
      }

    if (error || !Payment) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorCard}>
                    <p className={styles.errorMessage}>{error || "Payment details not found."}</p>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        <FiArrowLeft /> Back
                    </button>
                </div>
            </div>
        );
    }


    const invoiceType = Payment?.invoice?.type || "";
    const invoiceStatus = Payment?.invoice?.status || "";
    const isRenewal = invoiceType.toLowerCase() === "renewal" || invoiceStatus.toLowerCase() === "renewal";
    const hasOrder = Payment?.order && !isRenewal;

    const refunds = Payment?.refunds || [];

    return (
        <div className={styles.pageWrapper}>
            {/* Header Area */}
            <header className={styles.pageHeader}>
                <div className={styles.headerLeft}>
                    <Link to="#" onClick={(e) => { e.preventDefault(); navigate(-1); }} className={styles.backLink}>
                        <FiArrowLeft className={styles.backIcon} /> Payments
                    </Link>
                    <span className={styles.headerSeparator}>/</span>
                    <span className={styles.headerTitle}>#{Payment.id}</span>
                </div>
                <div className={styles.headerRight}>
                    <button className={styles.btnRefund}>
                        <FiRotateCcw className={styles.btnRefundIcon} /> Issue Another Refund
                    </button>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className={styles.contentGrid}>
                {/* Left side: Payment Summary */}
                <div className={`${styles.card}`}>
                    <h2 className={styles.cardTitle}>Payment Summary</h2>
                    <div className={styles.summaryList}>
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Payment ID</span>
                            <span className={`${styles.summaryValue} ${styles.paymentIdVal}`}>#{Payment.id}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Status</span>
                            <span className={getStatusBadgeClass(Payment.status)}>
                                {formatStatusLabel(Payment.status)}
                            </span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Amount</span>
                            <span className={styles.summaryValue}>
                                {formatCurrency(Payment.amount, Payment.currency)}
                            </span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Method</span>
                            <span className={styles.summaryValue}>
                                {formatPaymentMethod(Payment.paymentMethod)}
                            </span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Transaction ID</span>
                            <span className={styles.summaryValue} style={{ color: "#64748b" }}>
                                {Payment.transactionId || "—"}
                            </span>
                        </div>
                        {Payment.gatewayOrderId && (
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>Gateway Order</span>
                                <span className={styles.summaryValue} style={{ color: "#64748b" }}>
                                    {Payment.gatewayOrderId || "—"}
                                </span>
                            </div>
                        )}
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Paid At</span>
                            <span className={styles.summaryValue}>
                                {formatDateTime(Payment.paidAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right side: References */}
                <div className={`${styles.card}`}>
                    <h2 className={styles.cardTitle}>References</h2>
                    <div className={styles.referencesList}>
                        {/* INVOICE block */}
                        <div className={styles.referenceBlock}>
                            <span className={styles.refLabel}>Invoice</span>
                            {Payment.invoice ? (
                                <Link to={`/dashboard/invoice-details/${Payment.invoice.id}`} className={styles.refBox}>
                                    <div className={styles.refBoxLeft}>
                                        <span className={styles.refBoxId}>
                                            INV-{new Date(Payment.paidAt || Date.now()).getFullYear()}-{String(Payment.invoice.id).padStart(3, "0")}
                                        </span>
                                        <span className={styles.refBoxSub}>
                                            {Payment.invoice.type || "Initial"} &middot; {Payment.invoice.status || "Paid"}
                                        </span>
                                        <span className={styles.refBoxAmt}>
                                            {formatCurrency(Payment.invoice.total, Payment.invoice.currency)}
                                        </span>
                                    </div>
                                    <FiExternalLink className={styles.refArrowIcon} />
                                </Link>
                            ) : (
                                <div className={styles.refBox} style={{ color: "#94a3b8", fontStyle: "italic" }}>
                                    No invoice associated
                                </div>
                            )}
                        </div>

                        {/* SUBSCRIPTION block */}
                        <div className={styles.referenceBlock}>
                            <span className={styles.refLabel}>Subscription</span>
                            {Payment.subscriptionId ? (
                                <Link to={`/dashboard/subscriptionsview/${Payment.subscriptionId}`} className={styles.refBox}>
                                    <div className={styles.refBoxLeft}>
                                        <span className={styles.refBoxId}>
                                            SUB-{new Date(Payment.paidAt || Date.now()).getFullYear()}-{String(Payment.subscriptionId).padStart(3, "0")}
                                        </span>
                                    </div>
                                    <FiExternalLink className={styles.refArrowIcon} />
                                </Link>
                            ) : (
                                <div className={styles.refBox} style={{ color: "#94a3b8", fontStyle: "italic" }}>
                                    No subscription associated
                                </div>
                            )}
                        </div>

                        {/* LINKED ORDER block (Rule 5) */}
                        {hasOrder ? (
                            <div className={styles.referenceBlock}>
                                <span className={styles.refLabel}>Linked Order</span>
                                <Link to={`/dashboard/orders-details/${Payment.gatewayOrderId}`} className={styles.refBox}>
                                    <div className={styles.refBoxLeft}>
                                        <span className={styles.refBoxId}>
                                            ORD-{new Date(Payment.paidAt || Date.now()).getFullYear()}-{String(Payment.gatewayOrderId).substring(0, 5)}
                                        </span>
                                    </div>
                                    <FiExternalLink className={styles.refArrowIcon} />
                                </Link>
                            </div>
                        ) : ""}
                    </div>
                </div>
            </div>

            {/* Refund Summary Card */}
            <div className={styles.fullWidthCard}>
                <h2 className={styles.cardTitle}>Refund Summary</h2>
                <div className={styles.refundSummaryGrid}>
                    <div className={`${styles.refundSummaryBlock} styles.blockOriginal`} style={{ backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                        <span className={styles.blockLabel}>Original Amount</span>
                        <span className={`${styles.blockValue} ${styles.valOriginal}`}>
                            {formatCurrency(Payment.amount, Payment.currency)}
                        </span>
                    </div>
                    <div className={`${styles.refundSummaryBlock} styles.blockRefunded`} style={{ backgroundColor: "#fffbeb", border: "1px solid #fef3c7" }}>
                        <span className={styles.blockLabel} style={{ color: "#b45309" }}>Total Refunded Amount</span>
                        <span className={`${styles.blockValue} ${styles.valRefunded}`}>
                            {formatCurrency(Payment.refundedAmount, Payment.currency)}
                        </span>
                    </div>
                    <div className={`${styles.refundSummaryBlock} styles.blockRemaining`} style={{ backgroundColor: "#eff6ff", border: "1px solid #dbeafe" }}>
                        <span className={styles.blockLabel} style={{ color: "#1d4ed8" }}>Remaining Refundable</span>
                        <span className={`${styles.blockValue} ${styles.valRemaining}`}>
                            {Payment.remainingRefundableAmount ===0 ?"Fully Refunded": formatCurrency(Payment.remainingRefundableAmount, Payment.currency)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Refund History Card */}
            <div className={styles.fullWidthCard}>
                <h2 className={styles.cardTitle}>Refund History ({refunds.length})</h2>
                {refunds.length > 0 ? (
                    <div className={styles.timelineWrapper}>
                        <div className={styles.timelineLine}></div>
                        {refunds.map((refund, idx) => (
                            <div key={refund.id || idx} className={styles.timelineRow}>
                                <div className={styles.timelineNodeContainer}>
                                    <div className={styles.timelineNode}>
                                        <FiCheck className={styles.nodeIcon} />
                                    </div>
                                </div>
                                <div className={styles.refundCard}>
                                    <div className={styles.refundCardHeader}>
                                        <div className={styles.refundHeaderLeft}>
                                            <span className={`${styles.badge} ${styles.badgeCompleted}`}>
                                                {refund.status || "Completed"}
                                            </span>
                                            <span className={styles.refundId}>Refund #{refund.id}</span>
                                        </div>
                                        <div className={styles.refundAmount}>
                                            {formatCurrency(refund.amount, Payment.currency)}
                                        </div>
                                    </div>
                                    
                                    {refund.reason && (
                                        <div className={styles.reasonContainer}>
                                            &ldquo;{refund.reason}&rdquo;
                                        </div>
                                    )}

                                    <div className={styles.refundTimeCol}>
                                        <span className={styles.timeLabel}>Refunded At</span>
                                        <span className={styles.timeValue}>{formatDateTime(refund.refundedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyStateContainer}>
                        <div className={styles.emptyIconWrapper}>
                            <FiRotateCcw className={styles.emptyIcon} />
                        </div>
                        <h3 className={styles.emptyTitle}>No refunds issued</h3>
                        <p className={styles.emptySubtitle}>
                            This payment is eligible for a refund up to {formatCurrency(Payment.remainingRefundableAmount ?? Payment.amount, Payment.currency)}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
