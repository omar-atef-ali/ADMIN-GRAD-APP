import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddServices.module.css";
import * as yup from "yup";
import {
    FaArrowLeft,
    FaPlus,
    FaTrashAlt,
    FaTimes,
    FaCloudUploadAlt
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import api from "../../api";
import { userContext } from "../../context/userContext";
import toast from "react-hot-toast";

export default function AddServices() {
    const navigate = useNavigate();
    const { userToken } = useContext(userContext);

    // Media previews
    const [bannerPreview, setBannerPreview] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);

    // Refs for file inputs
    const bannerInputRef = useRef(null);
    const iconInputRef = useRef(null);

    // Key Benefits input temp state
    const [benefitInput, setBenefitInput] = useState("");

    // Pricing Plans modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPlanDuration, setNewPlanDuration] = useState("");
    const [newPlanPrice, setNewPlanPrice] = useState("");

    // Token list inside the modal
    const [tokensList, setTokensList] = useState([]); // [{ amount: "", price: "" }]

    // Sale inside the modal
    const [hasSale, setHasSale] = useState(false);
    const [newPlanDiscount, setNewPlanDiscount] = useState("");
    const [newPlanStartDate, setNewPlanStartDate] = useState("");
    const [newPlanEndDate, setNewPlanEndDate] = useState("");

    const nameLimit = 80;
    const subtitleLimit = 120;
    const descriptionLimit = 500;

    // Formik & Yup configuration
    const formik = useFormik({
        initialValues: {
            Name: "",
            SubTitle: "",
            Description: "",
            Priority: "",
            IsActive: true,
            Image: null,
            Icon: null,
            KeyBenefits: [],
            Prices: []
        },
        validationSchema: yup.object({
            Name: yup
                .string("Service name must be a string")
                .required("Service name is required")
                .max(80, "Service name must be 80 characters or less"),
            SubTitle: yup
                .string("Subtitle must be a string")
                .required("Subtitle is required")
                .max(120, "Subtitle must be 120 characters or less"),
            Description: yup
                .string("Description must be a string")
                .required("Description is required")
                .max(500, "Description must be 500 characters or less"),
            Priority: yup
                .number("Priority must be a number")
                .typeError("Priority must be a number")
                .required("Priority is required")
                .min(1, "Priority must be at least 1"),
            IsActive: yup.boolean(),
            Prices: yup
                .array()
                .min(1, "Please add at least one pricing plan")
                .required("Pricing plans are required")
        }),
        onSubmit: async (values) => {
            // const loadingAlert = Swal.fire({
            //     title: "Creating Service...",
            //     text: "Please wait while we set up the new service.",
            //     allowOutsideClick: false,
            //     didOpen: () => {
            //         Swal.showLoading();
            //     }
            // });

            try {
                const formData = new FormData();
                formData.append("Name", values.Name.trim());
                formData.append("SubTitle", values.SubTitle.trim());
                formData.append("Description", values.Description.trim());
                // formData.append("Priority", parseInt(values.Priority) || 1);
                formData.append("Priority", parseInt(values.Priority));
                formData.append("IsActive", values.IsActive);

                if (values.Image) {
                    formData.append("Image", values.Image);
                }
                if (values.Icon) {
                    formData.append("Icon", values.Icon);
                }

                // KeyBenefits
                values.KeyBenefits.forEach((benefit, index) => {
                    formData.append(`KeyBenefits[${index}].text`, benefit);
                    formData.append(`KeyBenefits[${index}].priority`, index + 1);
                });

                // Prices
                values.Prices.forEach((plan, index) => {
                    formData.append(`Prices[${index}].durationInDays`, parseInt(plan.duration) || 0);
                    formData.append(`Prices[${index}].price`, parseFloat(plan.price) || 0);

                    // tokens inside price plan
                    if (plan.tokens && plan.tokens.length > 0) {
                        plan.tokens.forEach((tok, tokIdx) => {
                            formData.append(`Prices[${index}].tokens[${tokIdx}].amount`, parseInt(tok.amount) || 0);
                            formData.append(`Prices[${index}].tokens[${tokIdx}].price`, parseFloat(tok.price) || 0);
                        });
                    }

                    // sales inside price plan
                    if (plan.saleApplied && plan.saleData) {
                        formData.append(`Prices[${index}].sales[0].discountPercentage`, parseFloat(plan.saleData.discountPercent) || 0);
                        formData.append(`Prices[${index}].sales[0].startDate`, new Date(plan.saleData.startDate).toISOString());
                        formData.append(`Prices[${index}].sales[0].endDate`, new Date(plan.saleData.endDate).toISOString());
                    }
                });

                await api.post("/admin/services", formData, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "multipart/form-data"
                    }
                });

                Swal.fire({
                    icon: "success",
                    title: "Service Created!",
                    text: "Your new service was successfully created.",
                    confirmButtonColor: "#4E3074"
                }).then(() => {
                    navigate("/dashboard/services");
                });

            } catch (error) {
                console.error("API error creating service", error);
                // const apiErrorMsg = error.response?.data?.message || error.response?.data?.errors?.[0] || "Failed to create service.";
                // Swal.fire({
                //     icon: "error",
                //     title: "Creation Failed",
                //     text: apiErrorMsg,
                //     confirmButtonColor: "#4E3074"
                // });
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
    });

    // Handle File uploads
    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            formik.setFieldValue("Image", file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            formik.setFieldValue("Icon", file);
            setIconPreview(URL.createObjectURL(file));
        }
    };

    // Key Benefits handlers
    const handleAddBenefit = () => {
        const trimmed = benefitInput.trim();
        if (trimmed && !formik.values.KeyBenefits.includes(trimmed)) {
            formik.setFieldValue("KeyBenefits", [...formik.values.KeyBenefits, trimmed]);
            setBenefitInput("");
        }
    };

    const handleBenefitKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddBenefit();
        }
    };

    const handleRemoveBenefit = (indexToRemove) => {
        formik.setFieldValue("KeyBenefits", formik.values.KeyBenefits.filter((_, index) => index !== indexToRemove));
    };

    // Pricing Plans handlers
    const openAddPlanModal = () => {
        setNewPlanDuration("");
        setNewPlanPrice("");
        setTokensList([]);
        setHasSale(false);
        setNewPlanDiscount("");
        setNewPlanStartDate("");
        setNewPlanEndDate("");
        setIsModalOpen(true);
    };

    const closeAddPlanModal = () => {
        setIsModalOpen(false);
    };

    const handleAddTokenRow = () => {
        setTokensList([...tokensList, { amount: "", price: "" }]);
    };

    const handleTokenRowChange = (index, field, value) => {
        const updated = [...tokensList];
        updated[index][field] = value;
        setTokensList(updated);
    };

    const handleRemoveTokenRow = (index) => {
        setTokensList(tokensList.filter((_, idx) => idx !== index));
    };

    const handleAddPricingPlan = (e) => {
        e.preventDefault();
        const priceNum = parseFloat(newPlanPrice);
        if (!newPlanDuration.trim() || isNaN(priceNum) || priceNum <= 0) {
            Swal.fire({
                icon: "error",
                title: "Invalid Input",
                text: "Please provide a valid duration and price.",
                confirmButtonColor: "#4E3074"
            });
            return;
        }

        // Validate token rows
        for (let i = 0; i < tokensList.length; i++) {
            const tok = tokensList[i];
            const tAmount = parseInt(tok.amount);
            const tPrice = parseFloat(tok.price);
            if (!tok.amount || isNaN(tAmount) || tAmount <= 0 || !tok.price || isNaN(tPrice) || tPrice <= 0) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid Token Row",
                    text: `Please enter a valid amount and price for token row ${i + 1}.`,
                    confirmButtonColor: "#4E3074"
                });
                return;
            }
        }

        // Validate sale if checked
        if (hasSale) {
            const discountNum = parseFloat(newPlanDiscount);
            if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid Discount",
                    text: "Discount percentage must be between 0 and 100.",
                    confirmButtonColor: "#4E3074"
                });
                return;
            }
            if (!newPlanStartDate || !newPlanEndDate) {
                Swal.fire({
                    icon: "error",
                    title: "Missing Sale Dates",
                    text: "Please select both start and end dates for the sale.",
                    confirmButtonColor: "#4E3074"
                });
                return;
            }
            if (new Date(newPlanStartDate) > new Date(newPlanEndDate)) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid Date Range",
                    text: "Start Date cannot be after End Date.",
                    confirmButtonColor: "#4E3074"
                });
                return;
            }
        }

        const newPlan = {
            id: Date.now(),
            duration: newPlanDuration.trim(),
            price: priceNum,
            tokens: tokensList.map(t => ({
                amount: parseInt(t.amount),
                price: parseFloat(t.price)
            })),
            saleApplied: hasSale,
            saleData: hasSale ? {
                discountPercent: parseFloat(newPlanDiscount),
                startDate: newPlanStartDate,
                endDate: newPlanEndDate
            } : null
        };

        formik.setFieldValue("Prices", [...formik.values.Prices, newPlan]);
        closeAddPlanModal();
    };

    const handleRemovePricingPlan = (id) => {
        formik.setFieldValue("Prices", formik.values.Prices.filter(plan => plan.id !== id));
    };

    const handleRemoveIcon = () => {
        formik.setFieldValue("Icon", null);
        setIconPreview(null);

        if (iconInputRef.current) {
            iconInputRef.current.value = "";
        }
    };
    const handleRemoveBanner = () => {
        formik.setFieldValue("Image", null);
        setBannerPreview(null);

        if (bannerInputRef.current) {
            bannerInputRef.current.value = "";
        }
    };

    return (
        <div className={styles.container}>
            {/* Top Navigation / Breadcrumbs */}
            <div className={styles.breadcrumbHeader}>
                <div className={styles.breadcrumbRow}>
                    <button
                        className={styles.backBtn}
                        onClick={() => navigate("/dashboard/services")}
                        title="Back to Services"
                        type="button"
                    >
                        <FaArrowLeft />
                    </button>
                    <span className={styles.breadcrumbLink} onClick={() => navigate("/dashboard/services")}>Services</span>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <span className={styles.breadcrumbActive}>New Service</span>
                </div>
                <h1 className={styles.pageTitle}>Add New Service</h1>
            </div>

            {/* Form Content Cards */}
            <form className={styles.formContainer} onSubmit={formik.handleSubmit}>

                {/* 1. Basic Information Card */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Basic Information</h3>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <div className={styles.labelRow}>
                                <label className={styles.label}>
                                    Service Name <span className={styles.required}>*</span>
                                </label>
                                <span className={styles.charCount}>
                                    {formik.values.Name.length}/{nameLimit}
                                </span>
                            </div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g., AI Recommendation"
                                maxLength={nameLimit}
                                name="Name"
                                value={formik.values.Name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.Name && formik.errors.Name && (
                                <span className={styles.errorMessage}>{formik.errors.Name}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.labelRow}>
                                <label className={styles.label}>
                                    Subtitle <span className={styles.required}>*</span>
                                </label>
                                <span className={styles.charCount}>
                                    {formik.values.SubTitle.length}/{subtitleLimit}
                                </span>
                            </div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g., Personalized AI-driven recommendations"
                                maxLength={subtitleLimit}
                                name="SubTitle"
                                value={formik.values.SubTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.SubTitle && formik.errors.SubTitle && (
                                <span className={styles.errorMessage}>{formik.errors.SubTitle}</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <div className={styles.labelRow}>
                            <label className={styles.label}>Description <span className={styles.required}>*</span></label>
                            <span className={styles.charCount}>
                                {formik.values.Description.length}/{descriptionLimit}
                            </span>
                        </div>
                        <textarea
                            className={styles.textarea}
                            placeholder="Describe what this service offers to your customers..."
                            maxLength={descriptionLimit}
                            rows={4}
                            name="Description"
                            value={formik.values.Description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.Description && formik.errors.Description && (
                            <span className={styles.errorMessage}>{formik.errors.Description}</span>
                        )}
                    </div>

                    <div className={styles.row} style={{ marginTop: "8px" }}>
                        <div className={styles.formGroup} style={{ flex: 1 }}>
                            <label className={styles.label}>Priority <span className={styles.required}>*</span></label>
                            <input
                                type="text"
                                className={styles.input}
                                name="Priority"
                                value={formik.values.Priority}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <span className={styles.helperText}>Lower number = higher display priority</span>
                            {formik.touched.Priority && formik.errors.Priority && (
                                <span className={styles.errorMessage}>{formik.errors.Priority}</span>
                            )}
                        </div>

                        <div className={styles.formGroup} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <label className={styles.label} style={{ marginBottom: "12px" }}>Status</label>
                            <div className={styles.toggleWrapper}>
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        name="IsActive"
                                        checked={formik.values.IsActive}
                                        onChange={formik.handleChange}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                                <span className={styles.toggleLabel}>Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Media Assets Card */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Media Assets</h3>

                    <div className={styles.mediaContainer}>
                        {/* Banner Upload */}
                        <div className={styles.bannerGroup}>
                            <div className={styles.labelRow}>
                                <label className={styles.label}>Banner Image</label>
                                <span className={styles.specText}>Recommended: 1200 x 400px · Max 5MB</span>
                            </div>

                            <div
                                className={styles.dropzone}
                                onClick={() => bannerInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={bannerInputRef}
                                    style={{ display: "none" }}
                                    accept="image/*"
                                    onChange={handleBannerChange}
                                />
                                {bannerPreview ? (
                                    <div className={styles.previewWrapper}>
                                        <button
                                            type="button"
                                            className={styles.removeBannerBtn}
                                            onClick={(e) => {
                                                e.stopPropagation(); // يمنع فتح اختيار الملفات
                                                handleRemoveBanner();
                                            }}
                                        >
                                            <FaTimes />
                                        </button>

                                        <img
                                            src={bannerPreview}
                                            alt="Banner Preview"
                                            className={styles.bannerPreviewImg}
                                        />

                                        <div className={styles.previewOverlay}>
                                            Click to replace image
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.dropzoneContent}>
                                        <FaCloudUploadAlt className={styles.uploadIcon} />
                                        <p className={styles.dropText}>
                                            Drag & drop or <span className={styles.browseText}>browse files</span>
                                        </p>
                                        <span className={styles.formatsText}>PNG, JPG, WebP</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Icon Upload */}
                        <div className={styles.iconGroup}>
                            <div className={styles.labelRow}>
                                <label className={styles.label}>Service Icon</label>
                                <span className={styles.specText}>Recommended: 256 x 256px · Max 1MB</span>
                            </div>

                            <div className={styles.iconUploadRow}>
                                <div
                                    className={styles.iconSquare}
                                    onClick={() => iconInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={iconInputRef}
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        onChange={handleIconChange}
                                    />

                                    {iconPreview ? (
                                        <>
                                            <img
                                                src={iconPreview}
                                                alt="Icon Preview"
                                                className={styles.iconPreviewImg}
                                            />

                                            <button
                                                type="button"
                                                className={styles.removeImageBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // يمنع فتح file picker
                                                    handleRemoveIcon();
                                                }}
                                            >
                                                <FaTimes />
                                            </button>
                                        </>
                                    ) : (
                                        <div className={styles.iconUploadPrompt}>
                                            <FaCloudUploadAlt />
                                            <span>Upload</span>
                                        </div>
                                    )}
                                </div>
                                <p className={styles.iconHintText}>
                                    The service icon appears on listing cards and in navigation.<br />
                                    PNG or SVG with a transparent background is recommended.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Key Benefits Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeaderWithButton}>
                        <h3 className={styles.cardTitle} style={{ margin: 0 }}>Key Benefits</h3>
                        <button
                            type="button"
                            className={styles.inlineAddBtn}
                            onClick={handleAddBenefit}
                        >
                            <FaPlus size={10} /> Add
                        </button>
                    </div>

                    <div className={styles.benefitInputWrapper}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Type a benefit and press Enter to add..."
                            value={benefitInput}
                            onChange={(e) => setBenefitInput(e.target.value)}
                            onKeyDown={handleBenefitKeyDown}
                        />
                    </div>

                    {formik.values.KeyBenefits.length > 0 && (
                        <div className={styles.tagsContainer}>
                            {formik.values.KeyBenefits.map((benefit, index) => (
                                <div key={index} className={styles.benefitTag}>
                                    <span className={styles.tagText}>{benefit}</span>
                                    <button
                                        type="button"
                                        className={styles.tagRemoveBtn}
                                        onClick={() => handleRemoveBenefit(index)}
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4. Pricing Configuration Card */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Pricing Configuration</h3>

                    {formik.values.Prices.length === 0 ? (
                        <div className={styles.emptyStateContainer}>
                            <p className={styles.emptyStateText}>No pricing plans configured yet.</p>
                        </div>
                    ) : (
                        <div className={styles.tableResponsive}>
                            <table className={styles.plansTable}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "15%" }}>Duration</th>
                                        <th style={{ width: "15%" }}>Price</th>
                                        <th style={{ width: "20%" }}>Tokens</th>
                                        <th style={{ width: "20%" }}>Tokens Price</th>
                                        <th style={{ width: "20%" }}>Active Sale</th>
                                        <th style={{ width: "10%", textAlign: "center" }}>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formik.values.Prices.map((plan) => (
                                        <tr key={plan.id}>
                                            <td className={styles.tableDuration}>{plan.duration}</td>
                                            <td className={styles.tablePrice}>EGP {plan.price.toLocaleString()}</td>
                                            <td>
                                                {plan.tokens && plan.tokens.length > 0 ? (
                                                    <div className={styles.tokensCellList}>
                                                        {plan.tokens.map((t, i) => (
                                                            <div key={i} className={styles.tokenItemText}>{t.amount.toLocaleString()} Tokens</div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className={styles.noSaleText}>—</span>
                                                )}
                                            </td>
                                            <td>
                                                {plan.tokens && plan.tokens.length > 0 ? (
                                                    <div className={styles.tokensCellList}>
                                                        {plan.tokens.map((t, i) => (
                                                            <div key={i} className={styles.tokenItemText}>EGP {t.price.toLocaleString()}</div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className={styles.noSaleText}>—</span>
                                                )}
                                            </td>
                                            <td>
                                                {plan.saleApplied && plan.saleData ? (
                                                    <div className={styles.activeSaleBadgeWrapper}>
                                                        <span className={styles.activeSaleBadge}>
                                                            -{plan.saleData.discountPercent}%
                                                        </span>
                                                        <span className={styles.saleDatesText}>
                                                            ({new Date(plan.saleData.startDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })} - {new Date(plan.saleData.endDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })})
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className={styles.noSaleText}>—</span>
                                                )}
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <button
                                                    type="button"
                                                    className={styles.tableRemoveBtn}
                                                    onClick={() => handleRemovePricingPlan(plan.id)}
                                                    title="Delete Pricing Plan"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {formik.touched.Prices && formik.errors.Prices && (
                        <div className={styles.errorMessage} style={{ marginBottom: "12px" }}>{formik.errors.Prices}</div>
                    )}

                    <button
                        type="button"
                        className={styles.secondaryThemeBtn}
                        onClick={openAddPlanModal}
                    >
                        <FaPlus size={10} /> Add Pricing Plan
                    </button>
                </div>

                {/* Footer Buttons */}
                <div className={styles.footerActions}>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => navigate("/dashboard/services")}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.primaryThemeBtn}
                        disabled={formik.isSubmitting}
                    >
                        Create Service
                    </button>
                </div>
            </form>

            {/* Custom Modal Popup for Adding Pricing Plan */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        {/* Modal Header */}
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Add Pricing Plan</h2>
                            <button
                                className={styles.modalCloseBtn}
                                onClick={closeAddPlanModal}
                                title="Close"
                                type="button"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleAddPricingPlan}>
                            <div className={styles.modalFormGroup}>
                                <label className={styles.modalLabel}>Duration</label>
                                <input
                                    type="text"
                                    className={styles.modalInput}
                                    placeholder="e.g. 30 Days"
                                    required
                                    value={newPlanDuration}
                                    onChange={(e) => setNewPlanDuration(e.target.value)}
                                />
                            </div>

                            <div className={styles.modalFormGroup}>
                                <label className={styles.modalLabel}>
                                    Price <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.priceInputWrapper}>
                                    <span className={styles.currencyPrefix}>E£</span>
                                    <input
                                        type="number"
                                        className={styles.priceInput}
                                        placeholder="5000"
                                        required
                                        min={1}
                                        value={newPlanPrice}
                                        onChange={(e) => setNewPlanPrice(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Add Tokens Button */}
                            <div className={styles.modalActionHeader}>
                                <button
                                    type="button"
                                    className={styles.modalAddBtn}
                                    onClick={handleAddTokenRow}
                                >
                                    <FaPlus size={10} /> Add Tokens
                                </button>
                            </div>

                            {/* Tokens List */}
                            {tokensList.map((token, index) => (
                                <div key={index} className={styles.modalRow}>
                                    <div className={styles.modalFormGroup} style={{ flex: 1, marginBottom: 0 }}>
                                        <label className={styles.modalLabel}>Tokens Amount</label>
                                        <input
                                            type="number"
                                            className={styles.modalInput}
                                            value={token.amount}
                                            onChange={(e) => handleTokenRowChange(index, "amount", e.target.value)}
                                            placeholder="e.g. 1000"
                                            required
                                        />
                                    </div>
                                    <div className={styles.modalFormGroup} style={{ flex: 1, marginBottom: 0 }}>
                                        <label className={styles.modalLabel}>Price <span className={styles.required}>*</span></label>
                                        <div className={styles.priceInputWrapper}>
                                            <span className={styles.currencyPrefix}>E£</span>
                                            <input
                                                type="number"
                                                className={styles.priceInput}
                                                value={token.price}
                                                onChange={(e) => handleTokenRowChange(index, "price", e.target.value)}
                                                placeholder="5000"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.modalRemoveRowBtn}
                                        onClick={() => handleRemoveTokenRow(index)}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            ))}

                            {/* Add Sale Button */}
                            {!hasSale && (
                                <div className={styles.modalActionHeader}>
                                    <button
                                        type="button"
                                        className={styles.modalAddBtn}
                                        onClick={() => setHasSale(true)}
                                    >
                                        <FaPlus size={10} /> Add Sale
                                    </button>
                                </div>
                            )}

                            {/* Sale configuration fields */}
                            {hasSale && (
                                <div className={styles.saleSectionContainer}>
                                    <div className={styles.modalRow} style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                        <span className={styles.saleSectionTitle}>Sale Configuration</span>
                                        <button
                                            type="button"
                                            className={styles.modalRemoveSaleBtn}
                                            onClick={() => {
                                                setHasSale(false);
                                                setNewPlanDiscount("");
                                                setNewPlanStartDate("");
                                                setNewPlanEndDate("");
                                            }}
                                        >
                                            Remove Sale
                                        </button>
                                    </div>

                                    <div className={styles.modalFormGroup}>
                                        <label className={styles.modalLabel}>Discount %</label>
                                        <input
                                            type="number"
                                            className={styles.modalInput}
                                            placeholder="10"
                                            value={newPlanDiscount}
                                            onChange={(e) => setNewPlanDiscount(e.target.value)}
                                            min={0}
                                            max={100}
                                            required={hasSale}
                                        />
                                    </div>

                                    <div className={styles.modalRow} style={{ marginBottom: 0 }}>
                                        <div className={styles.modalFormGroup} style={{ flex: 1, marginBottom: 0 }}>
                                            <label className={styles.modalLabel}>Start Date</label>
                                            <input
                                                type="date"
                                                className={styles.modalInput}
                                                value={newPlanStartDate}
                                                onChange={(e) => setNewPlanStartDate(e.target.value)}
                                                required={hasSale}
                                            />
                                        </div>
                                        <div className={styles.modalFormGroup} style={{ flex: 1, marginBottom: 0 }}>
                                            <label className={styles.modalLabel}>End Date</label>
                                            <input
                                                type="date"
                                                className={styles.modalInput}
                                                value={newPlanEndDate}
                                                onChange={(e) => setNewPlanEndDate(e.target.value)}
                                                required={hasSale}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Calculation Box */}
                            {hasSale && (
                                <div className={styles.modalSummaryBox}>
                                    <div className={styles.modalSummaryItem}>
                                        <span className={styles.modalSummaryLabel}>Original</span>
                                        <span className={styles.modalSummaryValueOriginal}>
                                            EGP {(parseFloat(newPlanPrice) || 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className={styles.modalSummaryItem}>
                                        <span className={styles.modalSummaryLabel}>Final</span>
                                        <span className={styles.modalSummaryValueFinal}>
                                            EGP {Math.round((parseFloat(newPlanPrice) || 0) - ((parseFloat(newPlanPrice) || 0) * (parseFloat(newPlanDiscount) || 0) / 100)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Modal Actions */}
                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.modalCancelBtn}
                                    onClick={closeAddPlanModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.modalSubmitBtn}
                                >
                                    Add Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}