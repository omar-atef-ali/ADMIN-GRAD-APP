import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import styles from "./AddPackages.module.css";
import api from "../../api";
import { userContext } from "../../context/userContext";
import {
    FaArrowLeft,
    FaCheck,
    FaCalendarAlt,
    FaBrain,
    FaChartBar,
    FaRegCommentDots,
    FaRobot
} from "react-icons/fa";



export default function AddPackages() {
    const navigate = useNavigate();
    const { userToken } = useContext(userContext);

    const [servicesList, setServicesList] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);

    // get All Services
    async function getAllServices() {
        try {
            setLoadingServices(true)
            const { data } = await api.get('/admin/services', {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            })
            console.log(data)
            setServicesList(data)

        }
        catch (error) {
            setLoadingServices(false)
            console.error("Login Error:", error);
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
        } finally {
            setLoadingServices(false)
        }
    }
    useEffect(() => {
        getAllServices()
    }, []);

    // Formik 
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            packageLevel: 0,
            durationInDays: 0,
            price: 0,
            priority: 1,
            isActive: true,
            services: [], // Array of { serviceId, tokenAmount }
            discountPercentage: 0,
            startDate: "",
            endDate: ""
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required("Package Name is required")
                .max(80, "Package Name must be 80 characters or less"),
            description: Yup.string()
                .max(200, "Description must be 200 characters or less"),
            packageLevel: Yup.number()
                .required("Package Level is required")
                .min(0, "Level must be a non-negative number"),
            durationInDays: Yup.number()
                .required("Duration is required")
                .min(1, "Duration must be at least 1 day"),
            price: Yup.number()
                .required("Price is required")
                .min(0, "Price must be a positive number"),
            priority: Yup.number()
                .required("Priority is required")
                .min(1, "Priority must be at least 1"),
            isActive: Yup.boolean(),
            discountPercentage: Yup.number()
                .min(0, "Discount cannot be negative")
                .max(100, "Discount cannot exceed 100%"),
            startDate: Yup.string().test(
                "is-required",
                "Start Date is required for active sales",
                function (value) {
                    const { discountPercentage } = this.parent;
                    if (discountPercentage > 0) {
                        return !!value;
                    }
                    return true;
                }
            ),
            endDate: Yup.string().test(
                "is-required",
                "End Date is required for active sales",
                function (value) {
                    const { discountPercentage, startDate } = this.parent;
                    if (discountPercentage > 0) {
                        if (!value) return false;
                        if (startDate && new Date(value) < new Date(startDate)) {
                            return this.createError({ message: "End Date cannot be before Start Date" });
                        }
                    }
                    return true;
                }
            )
        }),
        onSubmit: async (values, { setSubmitting }) => {
            const toastId = toast.loading("Creating package...");
            try {
                // 1. Prepare Package Payload
                const packagePayload = {
                    name: values.name,
                    description: values.description,
                    packageLevel: Number(values.packageLevel),
                    durationInDays: Number(values.durationInDays),
                    price: Number(values.price),
                    priority: Number(values.priority),
                    isActive: values.isActive,
                    services: values.services.map(s => ({
                        serviceId: Number(s.serviceId),
                        tokenAmount: Number(s.tokenAmount)
                    }))
                };

                // 2. Submit Package Creation API
                const packageResponse = await api.post('/admin/packages', packagePayload, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });

                // 3. Extract created Package ID (adapt depending on backend payload structure)
                const packageId = packageResponse.data?.id || packageResponse.data?.packageId || packageResponse.data;

                // 4. Sequential Sale API call if discount is configured
                if (values.discountPercentage > 0 && packageId) {
                    const salePayload = {
                        discountPercentage: Number(values.discountPercentage),
                        startDate: new Date(values.startDate).toISOString(),
                        endDate: new Date(values.endDate).toISOString()
                    };

                    // Send to sale configuration API
                    await api.post(`/admin/packages/${packageId}/sales`, salePayload, {
                        headers: {
                            Authorization: `Bearer ${userToken}`
                        }
                    });
                }

                toast.success("Package created successfully!", { id: toastId });
                navigate("/dashboard/packages");
            } catch (error) {
                console.error("API error", error);
                const apiErrorMsg = error.response?.data?.message || "Failed to create package";
                toast.error(apiErrorMsg, { id: toastId });
            } finally {
                setSubmitting(false);
            }
        }
    });

    // Handle Service Toggle selection
    const handleServiceSelect = (serviceId) => {
        const currentServices = [...formik.values.services];
        const index = currentServices.findIndex(s => s.serviceId === serviceId);

        if (index > -1) {
            currentServices.splice(index, 1);
        } else {
            currentServices.push({ serviceId: serviceId, tokenAmount: 0 });
        }

        formik.setFieldValue("services", currentServices);
    };

    const selectedServiceIds = formik.values.services.map(s => s.serviceId);

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.breadcrumbHeader}>
                <div className={styles.breadcrumbRow}>
                    <button
                        type="button"
                        className={styles.backBtn}
                        onClick={() => navigate("/dashboard/packages")}
                        title="Back to Packages"
                    >
                        <FaArrowLeft />
                    </button>
                    <span
                        className={styles.breadcrumbLink}
                        onClick={() => navigate("/dashboard/packages")}
                    >
                        Packages
                    </span>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <span className={styles.breadcrumbActive}>New Package</span>
                </div>
                <h1 className={styles.pageTitle}>Add New Package</h1>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className={styles.formContainer}>

                {/* 1. Package Information Card */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle} style={{ borderBottom: "1px solid rgba(203, 203, 203, 0.341)", paddingBottom: "10px", marginBottom: "20px" }}>
                        Package Information
                    </h3>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <div className={styles.labelRow}>
                                <label className={styles.label}>
                                    Package Name <span className={styles.required}>*</span>
                                </label>
                                <span className={styles.charCount}>
                                    {formik.values.name.length}/80
                                </span>
                            </div>
                            <input
                                type="text"
                                name="name"
                                className={`${styles.input} ${formik.touched.name && formik.errors.name ? styles.inputError : ""}`}
                                placeholder="e.g., Professional"
                                maxLength={80}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <span className={styles.errorText}>{formik.errors.name}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Package Level</label>
                            <input
                                type="number"
                                name="packageLevel"
                                className={`${styles.input} ${formik.touched.packageLevel && formik.errors.packageLevel ? styles.inputError : ""}`}
                                value={formik.values.packageLevel}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                min={0}
                            />
                            {formik.touched.packageLevel && formik.errors.packageLevel && (
                                <span className={styles.errorText}>{formik.errors.packageLevel}</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <div className={styles.labelRow}>
                            <label className={styles.label}>Description</label>
                            <span className={styles.charCount}>
                                {formik.values.description.length}/200
                            </span>
                        </div>
                        <textarea
                            name="description"
                            className={`${styles.textarea} ${formik.touched.description && formik.errors.description ? styles.textareaError : ""}`}
                            placeholder="Describe what this package offers to customers..."
                            maxLength={200}
                            rows={4}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.description && formik.errors.description && (
                            <span className={styles.errorText}>{formik.errors.description}</span>
                        )}
                    </div>

                    <div className={styles.row} style={{ marginTop: "8px" }}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Duration (Days)</label>
                            <input
                                type="number"
                                name="durationInDays"
                                className={`${styles.input} ${formik.touched.durationInDays && formik.errors.durationInDays ? styles.inputError : ""}`}
                                value={formik.values.durationInDays || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                min={1}
                            />
                            {formik.touched.durationInDays && formik.errors.durationInDays && (
                                <span className={styles.errorText}>{formik.errors.durationInDays}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Price (EGP) <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                className={`${styles.input} ${formik.touched.price && formik.errors.price ? styles.inputError : ""}`}
                                placeholder="EGP24999"
                                value={formik.values.price || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                min={0}
                            />
                            {formik.touched.price && formik.errors.price && (
                                <span className={styles.errorText}>{formik.errors.price}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Priority</label>
                            <input
                                type="number"
                                name="priority"
                                className={`${styles.input} ${formik.touched.priority && formik.errors.priority ? styles.inputError : ""}`}
                                value={formik.values.priority}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                min={1}
                            />
                            {formik.touched.priority && formik.errors.priority && (
                                <span className={styles.errorText}>{formik.errors.priority}</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                        <label className={styles.label}>Status</label>
                        <div className={styles.toggleWrapper}>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formik.values.isActive}
                                    onChange={formik.handleChange}
                                />
                                <span className={styles.slider}></span>
                            </label>
                            <span className={formik.values.isActive ? styles.toggleLabel : styles.toggleLabelInactive}>
                                {formik.values.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Service Composition Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeaderRow}>
                        <h3 className={styles.cardTitle}>Service Composition</h3>
                        <span className={styles.cardSubtitleText}>
                            {formik.values.services.length} services selected
                        </span>
                    </div>

                    {loadingServices ? (
                        <div style={{ textAlign: "center", padding: "16px", color: "#6b7280" }}>
                            Loading services...
                        </div>
                    ) : (
                        <div className={styles.servicesGrid}>
                            {servicesList.map((service) => {
                                const isSelected = selectedServiceIds.includes(service.id);
                                return (
                                    <div
                                        key={service.id}
                                        className={`${styles.serviceCard} ${isSelected ? styles.serviceCardSelected : ""}`}
                                        onClick={() => handleServiceSelect(service.id)}
                                    >
                                        <div className={`${styles.serviceCardIconWrapper} ${isSelected ? styles.serviceCardIconWrapperSelected : ""}`}>
                                            <img src={`https://deebai.runasp.net/${service.iconURL}`} alt="" />
                                        </div>
                                        <div className={styles.serviceCardDetails}>
                                            <h4 className={styles.serviceCardName}>{service.name}</h4>
                                            <p className={styles.serviceCardDesc}>{service.subTitle || service.description}</p>
                                        </div>
                                        {isSelected && (
                                            <FaCheck className={styles.serviceCheckmark} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 3. Service Configuration Card */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle} style={{ borderBottom: "1px solid rgba(203, 203, 203, 0.341)", paddingBottom: "10px", marginBottom: "20px" }}>
                        Service Configuration
                    </h3>

                    {formik.values.services.length === 0 ? (
                        <p className={styles.noConfigText}>
                            No services selected. Choose services from composition section above.
                        </p>
                    ) : (
                        <div className={styles.configSectionList}>
                            {servicesList.filter(s => selectedServiceIds.includes(s.id)).map((service) => {
                                const serviceIndex = formik.values.services.findIndex(item => item.serviceId === service.id);
                                const tokenAmount = serviceIndex > -1 ? formik.values.services[serviceIndex].tokenAmount : 0;
                                const isDashboard = service.name.toLowerCase() === "dashboard";

                                return (
                                    <div key={service.id} className={styles.configCard}>
                                        <div className={styles.configCardHeader}>
                                            <span className={styles.configCardIcon}>
                                                <img src={`https://deebai.runasp.net/${service.iconURL}`} alt="" />

                                            </span>
                                            <span className={styles.configCardTitle}>{service.name}</span>
                                        </div>

                                        {isDashboard ? (
                                            <div className={styles.configCardBodyUnlimited}>
                                                Unlimited Tokens
                                            </div>
                                        ) : (
                                            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                                <label className={styles.configInputLabel}>
                                                    Token Allocation
                                                    <span
                                                        style={{
                                                            marginLeft: "8px",
                                                            fontSize: "12px",
                                                            color: "#6B7280",
                                                            fontWeight: "400",
                                                        }}
                                                    >
                                                        (Leave empty for unlimited tokens)
                                                    </span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className={styles.input}
                                                    placeholder="Enter tokens allocation"
                                                    value={tokenAmount || ""}
                                                    min={0}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value) || 0;
                                                        const updatedServices = [...formik.values.services];
                                                        if (serviceIndex > -1) {
                                                            updatedServices[serviceIndex].tokenAmount = val;
                                                            formik.setFieldValue("services", updatedServices);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 4. Sale Configuration Card */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle} style={{ borderBottom: "1px solid rgba(203, 203, 203, 0.341)", paddingBottom: "10px", marginBottom: "20px" }}>
                        Sale Configuration
                    </h3>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Discount %</label>
                            <input
                                type="number"
                                name="discountPercentage"
                                className={`${styles.input} ${formik.touched.discountPercentage && formik.errors.discountPercentage ? styles.inputError : ""}`}
                                placeholder="0"
                                value={formik.values.discountPercentage || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                min={0}
                                max={100}
                            />
                            {formik.touched.discountPercentage && formik.errors.discountPercentage && (
                                <span className={styles.errorText}>{formik.errors.discountPercentage}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Start Date</label>
                            <div className={styles.datepickerWrapper}>
                                <input
                                    type="date"
                                    name="startDate"
                                    className={`${styles.dateInput} ${formik.touched.startDate && formik.errors.startDate ? styles.dateInputError : ""}`}
                                    value={formik.values.startDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    onClick={(e) => {
                                        try { e.target.showPicker(); } catch (err) { }
                                    }}
                                />
                                <FaCalendarAlt className={styles.dateIcon} />
                            </div>
                            {formik.touched.startDate && formik.errors.startDate && (
                                <span className={styles.errorText}>{formik.errors.startDate}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>End Date</label>
                            <div className={styles.datepickerWrapper}>
                                <input
                                    type="date"
                                    name="endDate"
                                    className={`${styles.dateInput} ${formik.touched.endDate && formik.errors.endDate ? styles.dateInputError : ""}`}
                                    value={formik.values.endDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    onClick={(e) => {
                                        try { e.target.showPicker(); } catch (err) { }
                                    }}
                                />
                                <FaCalendarAlt className={styles.dateIcon} />
                            </div>
                            {formik.touched.endDate && formik.errors.endDate && (
                                <span className={styles.errorText}>{formik.errors.endDate}</span>
                            )}
                        </div>
                    </div>

                    <p className={styles.salePricingText}>
                        Enter a discount percentage to preview the sale pricing.
                    </p>
                </div>

                {/* Buttons */}
                <div className={styles.footerActions}>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => navigate("/dashboard/packages")}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.createBtn}
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? "Creating..." : "Create Package"}
                    </button>
                </div>
            </form>
        </div>
    );
}