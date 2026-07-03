import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft,
    FaDatabase,
    FaMapMarkerAlt,
    FaGlobe,
    FaChartBar,
    FaPlus,
    FaShoppingCart,
    FaStar,
    FaHeart,
    FaTimes
} from 'react-icons/fa';
import styles from './CustomersView.module.css';
import toast from "react-hot-toast";
import api from '../../api';
import { useFormik } from 'formik';
import * as Yup from 'yup';


export default function CustomersView() {
    const {id}=useParams()
    const navigate = useNavigate();




    const [customer, setCustomer] = useState({});
    const [Subscription, setSubscription] = useState([]);
    // const [DatabaseCred,setDatabaseCred]=useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);




    // Formik setup for Tableau URL
    const formik = useFormik({
        initialValues: {
            tableauURL: '',
        },
        validationSchema: Yup.object({
            tableauURL: Yup.string()
                .url('Please enter a valid URL')
                .required('Tableau URL is required'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await api.put(
                    `/ClientSubscriptions/${Subscription.id}/tableau-url`,
                    { tableauURL: values.tableauURL }
                );
                setCustomer(prev => ({
                    ...prev,
                    tableauURL: values.tableauURL,
                }));
                toast.success('Tableau URL added successfully', {
                    position: 'top-center',
                    duration: 3000,
                });
                resetForm();
                setIsModalOpen(false);
            } catch (error) {
                toast.error(
                    error.response?.data?.errors?.[0] ||
                    'Failed to add Tableau URL.',
                    {
                        position: 'top-center',
                        duration: 4000,
                        style: {
                            background:
                                'linear-gradient(to right, rgba(121, 5, 5, 0.9), rgba(171, 0, 0, 0.85))',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '16px 20px',
                            color: '#ffffff',
                            fontSize: '0.95rem',
                            borderRadius: '5px',
                            width: '300px',
                            height: '100%',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
                        },
                        iconTheme: {
                            primary: '#FF4D4F',
                            secondary: '#ffffff',
                        },
                    }
                );
            } finally {
                setSubmitting(false);
            }
        },
    });

    // Handle opening modal
    const handleOpenModal = () => {
        if (!customer.tableauURL) {
            formik.resetForm();
            setIsModalOpen(true);
        }
    };

    // Handle closing modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Handle submitting URL
    // const handleAddUrl = (e) => {
    //     e.preventDefault();
    //     if (tempUrl.trim()) {
    //         // Update state dynamically
    //         setCustomer(prev => ({
    //             ...prev,
    //             tableauUrl: tempUrl.trim()
    //         }));
    //         setIsModalOpen(false);
    //     }
    // };

    async function getClient() {
        try {
            const { data } = await api.get(`/Clients/${id}`)
            console.log(data)
            setCustomer(data)
        }
        catch (error) {
            toast.error(
                error.response?.data?.errors[1] ||
                "Something went wrong while registration.",
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
    async function getSubscription() {
        try {
            const { data } = await api.get(`/Clients/${id}/subscriptions`)
            console.log(data)
            setSubscription(data)
        }
        catch (error) {
            toast.error(
                error.response?.data?.errors[1] ||
                "Something went wrong while registration.",
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


    //  async function getDatabase() {
    //     try {
    //         const { data } = await api.get(`/Clients/${id}/database-connections`)
    //         console.log(data)
    //         setDatabaseCred(data)
    //     }
    //     catch (error) {
    //         toast.error(
    //             error.response?.data?.errors[1] ||
    //             "Something went wrong while registration.",
    //             {
    //                 position: "top-center",
    //                 duration: 4000,
    //                 style: {
    //                     background:
    //                         "linear-gradient(to right, rgba(121, 5, 5, 0.9), rgba(171, 0, 0, 0.85))",
    //                     border: "1px solid rgba(255, 255, 255, 0.1)",
    //                     padding: "16px 20px",
    //                     color: "#ffffff",
    //                     fontSize: "0.95rem",
    //                     borderRadius: "5px",
    //                     width: "300px",
    //                     height: "100%",
    //                     boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
    //                 },
    //                 iconTheme: {
    //                     primary: "#FF4D4F",
    //                     secondary: "#ffffff",
    //                 },
    //             },
    //         );
    //     }
    // }

    useEffect(() => {
        getClient()
        getSubscription()
        // getDatabase()
    }, [])

    return (
        <div className={styles.container}>
            {/* Header section with back button and manage credentials */}
            <header className={styles.header}>
                <div className={styles.backSection}>
                    <button onClick={() => navigate(-1)} className={styles.backLink}>
                        <FaArrowLeft className={styles.backIcon} />
                        <span>Back</span>
                    </button>
                    <span className={styles.divider}>|</span>
                    <nav className={styles.breadcrumbs}>
                        <span className={styles.breadcrumbLink} onClick={() => navigate('/dashboard/users')}>Customers</span>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbActive}>{customer.fullName}</span>
                    </nav>
                </div>
                <button className={styles.manageBtn}>
                    <FaDatabase className={styles.manageIcon} />
                    <span>Manage Credentials</span>
                </button>
            </header>

            {/* Main Profile Card */}
            <section className={styles.profileCard}>
                <div className={styles.avatar}>
                    <span>{customer.fullName?.[0]}</span>
                </div>
                <div className={styles.profileInfo}>
                    <h1 className={styles.profileName}>{customer.fullName}</h1>
                    <p className={styles.profileEmail}>{customer.email}</p>
                    <p className={styles.profileCompany}>{customer?.businessName} · {customer?.position}</p>
                </div>
            </section>

            {/* Grid containing Customer Information and Account & Security */}
            <section className={styles.twoColGrid}>
                {/* Customer Information Card */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Customer Information</h2>

                    <div className={styles.infoRow}>
                        <span className={styles.infoKey}>Full Name</span>
                        <span className={styles.infoVal}>{customer.fullName}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.infoKey}>Email</span>
                        <span className={styles.infoVal}>{customer.email}</span>
                    </div>

                    {customer?.businessName != null && (
                        <div className={styles.infoRow}>
                            <span className={styles.infoKey}>Business Name</span>
                            <span className={styles.infoVal}>{customer.businessName}</span>
                        </div>
                    )}

                    {customer?.position !== null && (
                        <div className={styles.infoRow}>
                            <span className={styles.infoKey}>Position</span>
                            <span className={styles.infoVal}>{customer.position}</span>
                        </div>
                    )}

                    {customer?.businessAddress != null && (
                        <div className={styles.infoRow}>
                            <span className={styles.infoKey}>Business Address</span>
                            <span className={`${styles.infoVal} ${styles.addressVal}`}>
                                <FaMapMarkerAlt className={styles.markerIcon} /> {customer.businessAddress}
                            </span>
                        </div>
                    )}

                    {customer?.businessURL != null && (
                        <div className={styles.infoRow}>
                            <span className={styles.infoKey}>Business URL</span>
                            <span className={styles.infoVal}>
                                <a
                                    href={customer.businessURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.urlLink}
                                >
                                    <FaGlobe className={styles.globeIcon} /> {customer.businessURL}
                                </a>
                            </span>
                        </div>
                    )}

                    <div className={styles.infoRow}>
                        <span className={styles.infoKey}>Tableau URL</span>
                        <span className={styles.infoVal}>
                            <div className={styles.tableauCell}>
                                <FaChartBar className={styles.chartIcon} />
                                {customer?.tableauURL ? (
                                    <a href={customer.tableauURL} target="_blank" rel="noopener noreferrer" className={styles.urlLink}>
                                        {customer.tableauURL}
                                    </a>
                                ) : null}
                                <button
                                    onClick={handleOpenModal}
                                    disabled={!!customer.tableauURL}
                                    className={customer.tableauURL ? styles.addBtnDisabled : styles.addBtn}
                                >
                                    <FaPlus className={styles.plusIcon} /> Add
                                </button>
                            </div>
                        </span>
                    </div>
                </div>

                {/* Account & Security Card */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Account & Security</h2>

                    <div className={styles.infoRow}>
                        <span className={styles.infoKey}>Account Status</span>
                        <span className={styles.infoVal}>
                            <span className={styles.badgeActive}>{customer?.accountStatus}</span>
                        </span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.infoKey}>Email Confirmed</span>
                        <span className={styles.infoVal}>
                            <span className={styles.badgeActive}>{customer?.emailConfirmed ? "yes" : "No"}</span>
                        </span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.infoKey}>Failed Login Attempts</span>
                        <span className={styles.infoVal}>{customer?.failedLoginAttempts}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.infoKey}>Join Date</span>
                        <span className={styles.infoVal}>{new Date(customer?.joinedDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}</span>
                    </div>
                </div>
            </section>

            {/* Grid containing Subscription Summary and Activity Summary */}
            <section className={styles.twoColGrid}>


                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Subscription Summary</h2>

                    {Subscription?.map((s) => (
                        <div className={styles.subscriptionCard} key={s.id}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoKey}>Plan Type</span>
                                <span className={`${styles.infoVal} ${styles.boldText}`}>
                                    {s.planType}
                                </span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.infoKey}>Status</span>
                                <span className={styles.infoVal}>
                                    <span className={s.status === "Active" ? styles.badgeActive : styles.badgeRed}>{s.status}</span>
                                </span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.infoKey}>Start Date</span>
                                <span className={styles.infoVal}>
                                    {new Date(s.startDate).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>

                            {s.planType === "StandardPackage" ?
                                <div className={styles.infoRow}>
                                    <span className={styles.infoKey}>End Date</span>
                                    <span className={styles.infoVal}>
                                        {new Date(s.endDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div> : ""}


                        </div>
                    ))}
                </div>




                <div className={styles.card} style={{ alignSelf: 'start' }}>
                    <h2 className={styles.cardTitle}>Activity Summary</h2>

                    <div className={styles.activityGrid}>
                        {/* Orders Card */}
                        <div className={styles.activityCard}>
                            <div className={`${styles.activityIconContainer} ${styles.blueBg}`}>
                                <FaShoppingCart className={styles.blueIcon} />
                            </div>
                            <div className={styles.activityText}>
                                <span className={styles.activityCount}>{customer?.ordersCount}</span>
                                <span className={styles.activityLabel}>Orders</span>
                            </div>
                        </div>

                        {/* Reviews Card */}
                        <div className={styles.activityCard}>
                            <div className={`${styles.activityIconContainer} ${styles.yellowBg}`}>
                                <FaStar className={styles.yellowIcon} />
                            </div>
                            <div className={styles.activityText}>
                                <span className={styles.activityCount}>{customer?.reviewsCount}</span>
                                <span className={styles.activityLabel}>Reviews</span>
                            </div>
                        </div>

                        {/* Cart Items Card */}
                        {/* <div className={styles.activityCard}>
                            <div className={`${styles.activityIconContainer} ${styles.pinkBg}`}>
                                <FaHeart className={styles.pinkIcon} />
                            </div>
                            <div className={styles.activityText}>
                                <span className={styles.activityCount}>{customer.activity.cartItems}</span>
                                <span className={styles.activityLabel}>Cart Items</span>
                            </div>
                        </div> */}

                        {/* DB Connections Card */}
                        <div className={styles.activityCard}>
                            <div className={`${styles.activityIconContainer} ${styles.purpleBg}`}>
                                <FaDatabase className={styles.purpleIcon} />
                            </div>
                            <div className={styles.activityText}>
                                <span className={styles.activityCount}>{customer?.databaseConnectionsCount}</span>
                                <span className={styles.activityLabel}>DB Connections</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Database Credential Card */}
            {/* <section className={styles.fullWidthCard}>
                <h2 className={styles.cardTitle}>Database Credential</h2>

                <div className={styles.dbTableWrapper}>
                    <table className={styles.dbTable}>
                        <thead>
                            <tr>
                                <th>CONNECTION NAME</th>
                                <th>DB TYPE</th>
                                <th>HOST</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={styles.dbName}>{customer.dbCredential.connectionName}</td>
                                <td>
                                    <span className={styles.badgeBlue}>{customer.dbCredential.dbType}</span>
                                </td>
                                <td className={styles.dbHost}>{customer.dbCredential.host}</td>
                                <td>
                                    <span className={styles.badgeActive}>{customer.dbCredential.status}</span>
                                </td>
                                <td>
                                    <button className={styles.manageLink}>Manage</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section> */}

            {/* Tableau URL Modal */}
            {
                isModalOpen && (
                    <div className={styles.modalOverlay} onClick={handleCloseModal}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h3 className={styles.modalTitle}>Add Tableau URL</h3>
                                <button className={styles.closeBtn} onClick={handleCloseModal}>
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={formik.handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label className={styles.inputLabel} htmlFor="tableauURL">Tableau URL</label>
                                    <input
                                        id="tableauURL"
                                        name="tableauURL"
                                        type="url"
                                        value={formik.values.tableauURL}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`${styles.textInput} ${formik.touched.tableauURL && formik.errors.tableauURL ? styles.inputError : ''}`}
                                        placeholder="https://tableau.example.com/..."
                                        autoFocus
                                    />
                                    {formik.touched.tableauURL && formik.errors.tableauURL && (
                                        <p className={styles.errorText}>{formik.errors.tableauURL}</p>
                                    )}
                                </div>

                                <div className={styles.modalActions}>
                                    <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.submitBtn} disabled={formik.isSubmitting}>
                                        {formik.isSubmitting ? 'Adding...' : 'Add URL'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}