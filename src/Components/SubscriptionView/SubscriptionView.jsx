import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft,
    FaExclamationTriangle,
    FaSync,
    FaCube,
    FaTimes,
    FaInfoCircle,
    FaBolt,
    FaCheckCircle,
    FaClock,
    FaChevronDown,
    FaChevronUp,
    FaBan,
    FaRegCheckCircle,
    FaRegClock,
    FaRegTimesCircle,
    FaChartLine
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../api';
import styles from './SubscriptionView.module.css';
import { userContext } from '../../context/userContext';

export default function SubscriptionView() {
    const navigate = useNavigate();
    const {id}=useParams()
    const subscriptionId = id
    const [subscription, setSubscription] = useState(null);
    const [dataState, setDataState] = useState('populated'); // 'populated' or 'empty' for testing/empty views
    const [loading, setLoading] = useState(false);
    const { userToken } = useContext(userContext);
    // Modal state for schedule change
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackageId, setSelectedPackageId] = useState('');
    const [events, setEvents] = useState([]);
    const [packages, setPackages] = useState([]);
    const [addOns, setAddOns] = useState([]);
    const [renewalHistory, setRenewalHistory] = useState([]);


    const fetchSubscriptionDetails = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/admin/client-subscriptions/details/${subscriptionId}`);
            setSubscription(data);
            // console.log(data)
        } catch (error) {
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to fetch package.",
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
    };

    useEffect(() => {
        fetchSubscriptionDetails();
    }, [subscriptionId]);


    // Standard package API endpoints
    const handlePackageAutoRenewToggle = async () => {
        try {
            setLoading(true);
            await api.put(`/admin/client-subscriptions/package/${subscriptionId}/auto-renewal-toggle`);
            toast.success("Auto-renewal status updated successfully");
            fetchSubscriptionDetails();
        } catch (error) {
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to fetch package.",
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
    };

    const handlePackageCancel = async () => {
        try {
            setLoading(true);
            await api.put(`/admin/client-subscriptions/package/${subscriptionId}/cancel`);
            toast.success("Subscription cancelled successfully");
            fetchSubscriptionDetails();
        } catch (error) {
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to fetch package.",
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
    };

    const handlePackageTerminate = async () => {
        try {
            setLoading(true);
            await api.put(`/admin/client-subscriptions/package/${subscriptionId}/terminate`);
            toast.success("Subscription terminated immediately");
            fetchSubscriptionDetails();
        } catch (error) {
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to fetch package.",
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
    };

    const handlePackageReactivate = async () => {
        try {
            setLoading(true);
            await api.put(`/admin/client-subscriptions/package/${subscriptionId}/reactivate`);
            toast.success("Subscription reactivated successfully");
            fetchSubscriptionDetails();
        } catch (error) {
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to fetch package.",
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
    };

    // Customized package (Service Row-level) API endpoints
    const handleServiceAutoRenewToggle = async (subscriptionItemId) => {
        try {
            setLoading(true);
            await api.put(`/admin/client-subscriptions/service/${subscriptionId}/${subscriptionItemId}/auto-renewal-toggle`);
            toast.success("Service auto-renewal toggled successfully");
            fetchSubscriptionDetails();
        } catch (error) {
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to fetch package.",
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
    };

    const handleServiceCancel = async (subscriptionItemId) => {
        try {
            setLoading(true);
            await api.put(`/admin/client-subscriptions/service/${subscriptionId}/${subscriptionItemId}/cancel`);
            toast.success("Service renewal cancelled successfully");
            fetchSubscriptionDetails();
        } catch (error) {
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to fetch package.",
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
    };

    const handleServiceTerminate = async (subscriptionItemId) => {
        try {
            setLoading(true);
            await api.put(`/admin/client-subscriptions/service/${subscriptionId}/${subscriptionItemId}/terminate`);
            toast.success("Service terminated immediately");
            fetchSubscriptionDetails();
        } catch (error) {
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to fetch package.",
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
    };

    const handleServiceReactivate = async (subscriptionItemId) => {
        try {
            setLoading(true);
            await api.put(`/admin/client-subscriptions/service/${subscriptionId}/${subscriptionItemId}/reactivate`);
            toast.success("Service reactivated successfully");
            fetchSubscriptionDetails();
        } catch (error) {
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to fetch package.",
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
    };

    // Modal popup actions for Schedule Package Change
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPackageId('');
    };

    

    const handleCancelSchedule = async () => {
        try {
            setLoading(true);
            await api.put(`/admin/client-subscriptions/package/${subscriptionId}/cancel-scheduled-change`, {}, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            toast.success("Scheduled change cancelled successfully");
            fetchSubscriptionDetails();
            getEvents();
        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to cancel scheduled change.",
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
    };

    async function getEvents() {
        try {
            const { data } = await api.get(`/admin/client-subscriptions/events/${subscriptionId}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            })
            // console.log(data);
            setEvents(data);
        } catch (error) {
            console.log(error)
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to fetch event logs.",
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

    const getEventConfig = (eventType) => {
        switch (eventType) {
            case 'UpgradeImmediate':
                return {
                    icon: <FaBolt />,
                    iconClass: styles.purpleBg,
                    label: 'Immediate Upgrade'
                };
            case 'Terminated':
                return {
                    icon: <FaBan />,
                    iconClass: styles.redBg,
                    label: 'Forced Termination'
                };
            case 'Cancel':
            case 'Canceled':
                return {
                    icon: <FaExclamationTriangle />,
                    iconClass: styles.yellowBg,
                    label: 'Cancellation Scheduled'
                };
            case 'Reactivate':
            case 'Resume':
                return {
                    icon: <FaSync className={styles.syncIcon} />,
                    iconClass: styles.greenBg,
                    label: 'Subscription Reactivated'
                };
            case 'AutoRenewToggle':
                return {
                    icon: <FaSync />,
                    iconClass: styles.blueBg,
                    label: 'Auto-Renewal Toggled'
                };
            default:
                const formattedLabel = eventType ? eventType.replace(/([A-Z])/g, ' $1').trim() : 'Subscription Event';
                return {
                    icon: <FaInfoCircle />,
                    iconClass: styles.grayBg,
                    label: formattedLabel
                };
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };


    async function getPackages() {
        try{
            const {data} = await api.get(`/admin/packages`,{
                headers:{
                    Authorization: `Bearer ${userToken}`
                }
            })
            // console.log(data);
            setPackages(data);
        }catch(error){
            console.log(error)
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to fetch Packages.",
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

    async function changeSchedule(packageId) {
        try {
            setLoading(true);
            const { data } = await api.put(
                `/admin/client-subscriptions/package/${subscriptionId}/schedule-change/${packageId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                }
            );
            // console.log(data);
            toast.success("Schedule changed successfully.");
            fetchSubscriptionDetails();
            getEvents();
        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to change schedule.",
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

    const handleScheduleChangeSubmit = (e) => {
        e.preventDefault();
        if (selectedPackageId) {
            changeSchedule(selectedPackageId);
            handleCloseModal();
        }

    };

    async function getAddOns() {
        try {
            const {data} = await api.get(`/admin/client-subscriptions/add-ons/${subscriptionId}`,{
                headers:{
                    Authorization: `Bearer ${userToken}`
                }
            })
            // console.log(data);
            setAddOns(data);
        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to fetch Add-Ons.",
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

    async function getRenewalHistory() {
        try{
            const {data} = await api.get(`/admin/client-subscriptions/renewal-history/${subscriptionId}`,{
                headers:{
                    Authorization: `Bearer ${userToken}`
                }
            })
            console.log(data);
            setRenewalHistory(data);
        }catch(error){
            console.log(error);
            toast.error(
                error?.response?.data?.errors[1] ||
                "Failed to fetch Renewal History.",
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


    useEffect(() => {
        getEvents();
        getPackages();
        getAddOns();
        getRenewalHistory();
    }, [userToken, subscriptionId]);

    return (
        <div className={styles.wrapper}>
            {loading && (
                <div className={styles.overlay}>
                    <div className={styles.spinner}></div>
                </div>
            )}


            {/* Breadcrumbs Header */}
            <header className={styles.header}>
                <div className={styles.backSection}>
                    <button onClick={() => navigate(-1)} className={styles.backLink}>
                        <FaArrowLeft className={styles.backIcon} />
                        <span>Subscriptions</span>
                    </button>
                    <span className={styles.divider}>/</span>
                    <span className={styles.breadcrumbActive}>
                        SUB-2025-{subscriptionId < 10 ? '00' + subscriptionId : '0' + subscriptionId}
                    </span>
                </div>
            </header>

            {/* Scheduled Change Banner (Standard Package only) */}

            {subscription?.planType === 'StandardPackage' && subscription?.scheduledNewPackageId > 0 && subscription?.packageName !== subscription?.scheduledNewPackageName && (
                <div className={styles.scheduledBanner}>
                    <div className={styles.bannerLeft}>
                        <div className={styles.bannerIconCircle}>
                            <FaChartLine className={styles.bannerIcon} />
                        </div>
                        <div>
                            <h4 className={styles.bannerTitle}>Scheduled Package Change</h4>
                            <p className={styles.bannerSubtitle}>Will be applied at next renewal period</p>
                        </div>
                    </div>
                    <div className={styles.bannerDetailsGrid}>
                        <div className={styles.bannerCol}>
                            <span className={styles.bannerLabel}>Current Package</span>
                            <span className={styles.bannerValue}>{subscription?.packageName}</span>
                        </div>
                        <div className={styles.bannerCol}>
                            <span className={styles.bannerLabel}>Changing To</span>
                            <span className={`${styles.bannerValue} ${styles.purpleText}`}>
                                {subscription?.scheduledNewPackageName}
                            </span>
                        </div>
                        <div className={styles.bannerCol}>
                            <span className={styles.bannerLabel}>Effective Date</span>
                            <span className={styles.bannerValue}>{new Date(subscription?.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <div className={styles.bannerRight}>
                        <span className={styles.badgeScheduled}>Scheduled</span>
                        <button className={styles.cancelScheduleBtn} onClick={handleCancelSchedule} title="Cancel scheduled change">
                            <FaRegTimesCircle className={styles.cancelScheduleIcon} />
                            <span>Cancel Scheduled Change</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Package Section */}
            <section className={styles.cardSection}>
                {subscription?.planType === 'CustomizedPlan' ? (
                    /* Customized Package Layout */
                    <div className={styles.mainCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Customized Package</h2>
                        </div>

                        <div className={styles.tableWrapper}>
                            <table className={styles.packageTable}>
                                <thead>
                                    <tr>
                                        <th>SERVICE</th>
                                        <th>STATUS</th>
                                        <th>START DATE</th>
                                        <th>END DATE</th>
                                        <th>AUTO RENEW</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscription?.services?.map((service) => {
                                        const isAutoRenew = service.autoRenew;
                                        const status = service.status;

                                        return (
                                            <tr key={service.subscriptionItemId}>
                                                <td className={styles.serviceName}>{service.name}</td>
                                                <td>
                                                    {status === 'Active' && <span className={styles.badgeActive}>Active</span>}
                                                    {status === 'Canceled' && (
                                                        <span className={styles.badgeExpired} style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                                                            Canceled
                                                        </span>
                                                    )}
                                                    {(status === 'Terminated') && (
                                                        <span className={styles.badgeExpired}>Terminated</span>
                                                    )}
                                                    {status === 'Expired' && (
                                                        <span className={styles.badgeExpired}>Expired</span>
                                                    )}
                                                </td>
                                                <td>{new Date(service.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                <td>{new Date(service.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                <td>
                                                    {isAutoRenew ? (
                                                        <span className={styles.badgeRenewEnabled}>
                                                            <FaSync className={styles.syncIcon} /> Enabled
                                                        </span>
                                                    ) : (
                                                        <span className={styles.badgeRenewDisabled}>Disabled</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className={styles.actionsCell}>
  
                                                        <label className={styles.switch}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isAutoRenew}
                                                                onChange={() => handleServiceAutoRenewToggle(service.subscriptionItemId)}
                                                                disabled={status !== "Active"}
                                                            />
                                                            <span className={styles.slider}></span>
                                                        </label>

                                                        {status === 'Active' && (
                                                            <button
                                                                className={styles.cancelRowBtn}
                                                                onClick={() => handleServiceCancel(service.subscriptionItemId)}
                                                                title="Cancel Auto-renew"
                                                            >
                                                                <FaExclamationTriangle className={styles.warningIcon} />
                                                            </button>
                                                        )}

                                                        {status === 'Canceled' && (
                                                            <div className={styles.rowActionButtons}>
                                                                <button
                                                                    className={styles.resumeRowBtn}
                                                                    onClick={() => handleServiceReactivate(service.subscriptionItemId)}
                                                                    title="Resume"
                                                                >
                                                                    <FaSync />
                                                                </button>
                                                                <button
                                                                    className={styles.endRowBtn}
                                                                    onClick={() => handleServiceTerminate(service.subscriptionItemId)}
                                                                    title="End Now"
                                                                >
                                                                    <FaBan />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Standard Package Layout */
                    <div className={styles.mainCard}>
                        <div className={styles.cardHeaderWithBtn}>
                            <h2 className={styles.cardTitle}>Standard Package</h2>
                            <button className={styles.scheduleChangeBtn} onClick={handleOpenModal}>
                                <FaSync className={styles.btnIcon} />
                                <span>Schedule Change</span>
                            </button>
                        </div>

                        {/* Package Info Card Box */}
                        <div className={styles.packageDetailBox}>
                            <div className={styles.boxLeft}>
                                <div className={styles.packageIconCircle}>
                                    <FaCube className={styles.packageCubeIcon} />
                                </div>
                                <div className={styles.packageMeta}>
                                    <div className={styles.packageTitleRow}>
                                        <h3 className={styles.packageName}>{subscription?.packageName}</h3>
                                        {subscription?.packageStatus === 'Canceled' || subscription?.packageStatus === 'Terminated' ? (
                                            <span className={styles.badgeCanceledOutline}>{subscription.packageStatus}</span>
                                        ) : (
                                            <>
                                                <span className={styles.badgeActiveFilled}>Active</span>
                                                {subscription?.packageAutoRenew && (
                                                    <span className={styles.badgeRenewEnabledOutline}>
                                                        <FaSync className={styles.syncIcon} /> Auto-Renew
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className={styles.featuresRow}>
                                        {subscription?.services?.map((srv) => (
                                            <span key={srv.serviceId} className={styles.featureBadge}>
                                                <FaCheckCircle className={styles.checkIcon} /> {srv.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.boxRight}>
                                <div className={styles.dateCol}>
                                    <span className={styles.dateLabel}>Start Date</span>
                                    <span className={styles.dateValue}>{new Date(subscription?.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className={styles.dateCol}>
                                    <span className={styles.dateLabel}>End Date</span>
                                    <span className={`${styles.dateValue} ${styles.goldText}`}>{new Date(subscription?.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                        {subscription?.packageStatus === "Active" && (
                            <div className={styles.standardActiveActions}>
                                <div className={styles.autoRenewStatus}>
                                    <div>
                                        <p className={styles.autoRenewLabel}>Auto-renewal</p>
                                        <span className={styles.autoRenewSub}>
                                            Automatically renew at{" "}
                                            {new Date(subscription?.endDate).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    <label className={styles.switch}>
                                        <input
                                            type="checkbox"
                                            checked={subscription?.packageAutoRenew || false}
                                            onChange={handlePackageAutoRenewToggle}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>

                                <div className={styles.standardActiveButtons}>
                                    <button
                                        className={styles.cancelSubscriptionBtn}
                                        onClick={handlePackageCancel}
                                    >
                                        <FaExclamationTriangle className={styles.btnWarningIcon} />
                                        <span>Cancel Subscription</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {subscription?.packageStatus === "Canceled" && (
                            <div className={styles.standardCanceledActions}>
                                <div className={styles.cancelAlertBanner}>
                                    <FaExclamationTriangle className={styles.alertBannerIcon} />
                                    <div>
                                        <h4 className={styles.alertBannerTitle}>Subscription Cancelled</h4>
                                        <p className={styles.alertBannerText}>
                                            Your service will remain active until{" "}
                                            <strong>
                                                {new Date(subscription?.endDate).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </strong>
                                            . After that, all services will be paused.
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.canceledButtons}>
                                    <button
                                        className={styles.resumeSubscriptionBtn}
                                        onClick={handlePackageReactivate}
                                    >
                                        <FaSync className={styles.btnIcon} />
                                        <span>Resume Subscription</span>
                                    </button>

                                    <button
                                        className={styles.endNowBtnOutline}
                                        onClick={handlePackageTerminate}
                                    >
                                        <FaBan className={styles.btnIcon} />
                                        <span>End Now</span>
                                    </button>
                                </div>
                            </div>
                        )}


                    </div>
                )}
            </section>

            {/* Split Section: Add-ons & Renewal History */}
            <section className={styles.splitSection}>
                {/* Add-ons Box */}
                <div className={styles.splitCard}>
                    <h3 className={styles.splitCardTitle}>Add-ons</h3>

                    {!addOns || addOns.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIconCircleDashed}>
                                <FaBolt className={styles.emptyIcon} />
                            </div>
                            <p className={styles.emptyText}>No add-ons included</p>
                        </div>
                    ) : (
                        <div className={styles.splitTableWrapper}>
                            <table className={styles.splitTable}>
                                <thead>
                                    <tr>
                                        <th>ADD-ON NAME</th>
                                        <th>VALUE</th>
                                        <th>PURCHASED ON</th>
                                        <th>PRICE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {addOns.map((addon) => {
                                        const isToken = addon.tokenAmount !== null && addon.tokenAmount !== undefined;
                                        const displayValue = isToken ? `+${addon.tokenAmount?.toLocaleString()} tokens` : `+${addon.durationDays} Days`;
                                        return (
                                            <tr key={addon.id}>
                                                <td>
                                                    <span className={styles.tableBadgeGray}>{addon.name}</span>
                                                </td>
                                                <td>
                                                    <span className={styles.tableBadgePurple}>
                                                        {isToken ? (
                                                            <FaBolt className={styles.badgeBoltIcon} />
                                                        ) : (
                                                            <FaClock className={styles.badgeClockIcon} />
                                                        )}
                                                        {displayValue}
                                                    </span>
                                                </td>
                                                <td>{formatDateOnly(addon.purchasedOn)}</td>
                                                <td className={styles.boldText}>EGP {addon.price?.toLocaleString()}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Renewal History Box */}
                <div className={styles.splitCard}>
                    <h3 className={styles.splitCardTitle}>Renewal History</h3>

                    {!renewalHistory || renewalHistory.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIconCircleDashed}>
                                <FaSync className={styles.emptyIcon} />
                            </div>
                            <p className={styles.emptyText}>No renewal history yet</p>
                        </div>
                    ) : (
                        <div className={styles.splitTableWrapper}>
                            <table className={styles.splitTable}>
                                <thead>
                                    <tr>
                                        <th>DATE</th>
                                        <th>AMOUNT</th>
                                        <th>PAYMENT</th>
                                        <th>REFERENCE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renewalHistory.map((ren) => {
                                        let statusClass = styles.badgePaid;
                                        const statusLower = ren.status?.toLowerCase();
                                        if (statusLower === 'pending') {
                                            statusClass = styles.badgePending;
                                        } else if (statusLower === 'failed' || statusLower === 'cancelled' || statusLower === 'refunded') {
                                            statusClass = styles.badgeFailed;
                                        }
                                        return (
                                            <tr key={ren.invoiceId}>
                                                <td>{formatDateOnly(ren.billingDate)}</td>
                                                <td className={styles.boldText}>
                                                    {ren.currency} {ren.amount?.toLocaleString()}
                                                </td>
                                                <td>
                                                    <span className={statusClass}>{ren.status}</span>
                                                </td>
                                                <td className={styles.purpleRef}>{ren.transactionId || '-'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            {/* Event Log Section */}
            <section className={styles.cardSection}>
                <div className={styles.mainCard}>
                    <h3 className={styles.eventLogTitle}>Event Log</h3>

                    <div className={styles.timeline}>
                        {events.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIconCircleDashed}>
                                    <FaRegClock className={styles.emptyIcon} />
                                </div>
                                <p className={styles.emptyText}>No events logged for this subscription</p>
                            </div>
                        ) : (
                            events.map((ev) => {
                                const config = getEventConfig(ev.eventType);
                                const hasDateChange = ev.oldEndDate && ev.newEndDate && ev.oldEndDate !== ev.newEndDate;
                                return (
                                    <div className={styles.timelineItem} key={ev.id}>
                                        <div className={`${styles.timelineIcon} ${config.iconClass}`}>
                                            {config.icon}
                                        </div>
                                        <div className={styles.timelineContent}>
                                            <div className={styles.timelineHeader}>
                                                <h4 className={styles.timelineTitle}>{config.label}</h4>
                                                <span className={styles.timelineDate}>{formatDateTime(ev.createdOn)}</span>
                                            </div>

                                            {ev.remarks && (
                                                <div className={styles.timelineDescBox}>
                                                    {ev.remarks}
                                                </div>
                                            )}

                                            {/* Date changes visual representation */}
                                            {hasDateChange && (
                                                <div className={styles.dateChangeContainer}>
                                                    <div className={styles.dateChangeCard}>
                                                        <span className={styles.dateChangeLabel}>Previous End Date</span>
                                                        <span className={styles.dateChangeVal}>{formatDateOnly(ev.oldEndDate)}</span>
                                                    </div>
                                                    <div className={styles.dateChangeArrow}>
                                                        ➔
                                                    </div>
                                                    <div className={styles.dateChangeCard}>
                                                        <span className={styles.dateChangeLabel}>New End Date</span>
                                                        <span className={styles.dateChangeVal}>{formatDateOnly(ev.newEndDate)}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {ev.triggeredBy && (
                                                <div className={styles.triggeredBadge} title={`Triggered by ID: ${ev.triggeredBy}`}>
                                                    <span>By: {ev.triggeredBy.substring(0, 20)}...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* Schedule Change Modal Popup */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalHeaderLeft}>
                                <div className={styles.modalIconCircle}>
                                    <FaSync className={styles.modalHeaderIcon} />
                                </div>
                                <div>
                                    <h3 className={styles.modalTitle}>Schedule Package Change</h3>
                                    <p className={styles.modalSubtitle}>SUB-2025-{subscriptionId < 10 ? '00' + subscriptionId : '0' + subscriptionId}</p>
                                </div>
                            </div>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleScheduleChangeSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.inputLabel}>Current Package</label>
                                <div className={styles.readOnlyInput}>{subscription?.packageName}</div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.inputLabel} htmlFor="targetPackage">Target Package</label>
                                <select
                                    id="targetPackage"
                                    className={styles.selectInput}
                                    value={selectedPackageId}
                                    onChange={(e) => {
                                        console.log("Selected Package ID:", e.target.value);
                                        setSelectedPackageId(e.target.value);
                                    }}
                                    required
                                >
                                    <option value="">Select Package</option>
                                    {packages.length > 0 ? (
                                        packages
                                            .filter((pkg) => pkg.name !== subscription?.packageName)
                                            .map((pkg) => (
                                                <option key={pkg.id} value={pkg.id}>
                                                    {pkg.name}
                                                </option>
                                            ))
                                    ) : (
                                       <option value="">No packages available</option>
                                    )}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.inputLabel}>Effective Date</label>
                                <div className={styles.readOnlyInput}>{new Date(subscription?.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                            </div>

                            <div className={styles.modalAlertInfo}>
                                <FaRegCheckCircle className={styles.modalAlertIcon} />
                                <span>The package change will be applied at the next renewal period.</span>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className={styles.modalCancelBtn} onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.modalSubmitBtn}
                                    disabled={!selectedPackageId}
                                >
                                    Schedule Change
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}