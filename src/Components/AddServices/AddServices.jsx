import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddServices.module.css";
import {
    FaArrowLeft,
    FaPlus,
    FaTrashAlt,
    FaTimes,
    FaBolt,
    FaCalendarAlt,
    FaCloudUploadAlt
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useFormik } from "formik";

export default function AddServices() {
    const navigate = useNavigate();

    // let formik = useFormik({
    //     initialValues: {
    //         ServiceName: "",
    //         Subtitle: "",
    //         Description: "",
    //         Priority: 1,
    //         Status: true,
    //     },
    //     onSubmit:s

    // })

    // Basic Information states
    const [name, setName] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState(1);
    const [status, setStatus] = useState(true); // true = Active, false = Inactive

    // Media Assets states
    const [bannerImage, setBannerImage] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [serviceIcon, setServiceIcon] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);

    // Refs for file inputs
    const bannerInputRef = useRef(null);
    const iconInputRef = useRef(null);

    // Key Benefits states
    const [benefitInput, setBenefitInput] = useState("");
    const [benefits, setBenefits] = useState([]);

    // Pricing Plans states
    const [pricingPlans, setPricingPlans] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPlanDuration, setNewPlanDuration] = useState("");
    const [newPlanPrice, setNewPlanPrice] = useState("");

    // Accordion State for Sales section
    // Stores the plan ID of the open sale dropdown
    const [openSaleId, setOpenSaleId] = useState(null);

    // Temp inputs for Sales (tracked per plan to allow editing before applying)
    const [salesData, setSalesData] = useState({}); // format: { [planId]: { discountPercent: '', startDate: '', endDate: '' } }

    // Handle character limit count helpers
    const nameLimit = 80;
    const subtitleLimit = 120;
    const descriptionLimit = 500;

    // Handle File uploads
    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerImage(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setServiceIcon(file);
            setIconPreview(URL.createObjectURL(file));
        }
    };

    // Key Benefits handlers
    const handleAddBenefit = () => {
        const trimmed = benefitInput.trim();
        if (trimmed && !benefits.includes(trimmed)) {
            setBenefits([...benefits, trimmed]);
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
        setBenefits(benefits.filter((_, index) => index !== indexToRemove));
    };

    // Pricing Plans handlers
    const openAddPlanModal = () => {
        setNewPlanDuration("");
        setNewPlanPrice("");
        setIsModalOpen(true);
    };

    const closeAddPlanModal = () => {
        setIsModalOpen(false);
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

        const newPlan = {
            id: Date.now(),
            duration: newPlanDuration.trim(),
            price: priceNum,
            discountPercent: null,
            startDate: null,
            endDate: null,
            saleApplied: false
        };

        setPricingPlans([...pricingPlans, newPlan]);

        // Initialize sales data helper for this plan
        setSalesData(prev => ({
            ...prev,
            [newPlan.id]: {
                discountPercent: "",
                startDate: "",
                endDate: ""
            }
        }));

        closeAddPlanModal();
    };

    const handleRemovePricingPlan = (id) => {
        setPricingPlans(pricingPlans.filter(plan => plan.id !== id));
        // Remove from sales inputs and close dropdown if it was open
        const updatedSales = { ...salesData };
        delete updatedSales[id];
        setSalesData(updatedSales);
        if (openSaleId === id) {
            setOpenSaleId(null);
        }
    };

    // Sales Accordion handlers
    const toggleSaleDropdown = (planId) => {
        if (openSaleId === planId) {
            setOpenSaleId(null);
        } else {
            setOpenSaleId(planId);
        }
    };

    const handleSalesInputChange = (planId, field, value) => {
        setSalesData(prev => ({
            ...prev,
            [planId]: {
                ...prev[planId],
                [field]: value
            }
        }));
    };

    const handleApplySale = (planId) => {
        const planSalesInput = salesData[planId];
        const discount = parseFloat(planSalesInput?.discountPercent);
        const start = planSalesInput?.startDate;
        const end = planSalesInput?.endDate;

        if (isNaN(discount) || discount < 0 || discount > 100) {
            Swal.fire({
                icon: "error",
                title: "Invalid Discount",
                text: "Please provide a discount between 0 and 100%.",
                confirmButtonColor: "#4E3074"
            });
            return;
        }

        if (!start || !end) {
            Swal.fire({
                icon: "error",
                title: "Dates Required",
                text: "Please choose both start and end dates.",
                confirmButtonColor: "#4E3074"
            });
            return;
        }

        if (new Date(start) > new Date(end)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Date Range",
                text: "Start Date cannot be after End Date.",
                confirmButtonColor: "#4E3074"
            });
            return;
        }

        // Update pricing plan with sale details
        setPricingPlans(prevPlans => prevPlans.map(plan => {
            if (plan.id === planId) {
                return {
                    ...plan,
                    discountPercent: discount,
                    startDate: start,
                    endDate: end,
                    saleApplied: true
                };
            }
            return plan;
        }));

        Swal.fire({
            icon: "success",
            title: "Sale Applied",
            text: "Discount successfully configured for this pricing plan.",
            confirmButtonColor: "#4E3074",
            timer: 1500,
            showConfirmButton: false
        });

        // Close dropdown
        setOpenSaleId(null);
    };

    // Form Submission
    const handleCreateService = () => {
        if (!name.trim()) {
            Swal.fire({
                icon: "error",
                title: "Required Field",
                text: "Service Name is required.",
                confirmButtonColor: "#4E3074"
            });
            return;
        }
        if (!subtitle.trim()) {
            Swal.fire({
                icon: "error",
                title: "Required Field",
                text: "Subtitle is required.",
                confirmButtonColor: "#4E3074"
            });
            return;
        }

        // Mock saving service
        Swal.fire({
            icon: "success",
            title: "Service Created!",
            text: "Your new service was successfully created.",
            confirmButtonColor: "#4E3074"
        }).then(() => {
            navigate("/dashboard/services");
        });
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
            <form className={styles.formContainer}>

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
                                    {name.length}/{nameLimit}
                                </span>
                            </div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g., AI Recommendation"
                                maxLength={nameLimit}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.labelRow}>
                                <label className={styles.label}>
                                    Subtitle <span className={styles.required}>*</span>
                                </label>
                                <span className={styles.charCount}>
                                    {subtitle.length}/{subtitleLimit}
                                </span>
                            </div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g., Personalized AI-driven recommendations"
                                maxLength={subtitleLimit}
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <div className={styles.labelRow}>
                            <label className={styles.label}>Description</label>
                            <span className={styles.charCount}>
                                {description.length}/{descriptionLimit}
                            </span>
                        </div>
                        <textarea
                            className={styles.textarea}
                            placeholder="Describe what this service offers to your customers..."
                            maxLength={descriptionLimit}
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className={styles.row} style={{ marginTop: "8px" }}>
                        <div className={styles.formGroup} style={{ flex: 1 }}>
                            <label className={styles.label}>Priority</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={priority}
                                min={1}
                                onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
                            />
                            <span className={styles.helperText}>Lower number = higher display priority</span>
                        </div>

                        <div className={styles.formGroup} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <label className={styles.label} style={{ marginBottom: "12px" }}>Status</label>
                            <div className={styles.toggleWrapper}>
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        checked={status}
                                        onChange={() => setStatus(!status)}
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
                                        <img src={bannerPreview} alt="Banner Preview" className={styles.bannerPreviewImg} />
                                        <div className={styles.previewOverlay}>Click to replace image</div>
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
                                        <img src={iconPreview} alt="Icon Preview" className={styles.iconPreviewImg} />
                                    ) : (
                                        <div className={styles.iconUploadPrompt}>
                                            <FaCloudUploadAlt className={styles.miniUploadIcon} />
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

                    {benefits.length > 0 && (
                        <div className={styles.tagsContainer}>
                            {benefits.map((benefit, index) => (
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

                    {pricingPlans.length === 0 ? (
                        <div className={styles.emptyStateContainer}>
                            <p className={styles.emptyStateText}>No pricing plans configured yet.</p>
                        </div>
                    ) : (
                        <div className={styles.tableResponsive}>
                            <table className={styles.plansTable}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "30%" }}>Duration</th>
                                        <th style={{ width: "30%" }}>Price</th>
                                        <th style={{ width: "25%" }}>Active Sale</th>
                                        <th style={{ width: "15%", textAlign: "center" }}>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pricingPlans.map((plan) => (
                                        <tr key={plan.id}>
                                            <td className={styles.tableDuration}>{plan.duration}</td>
                                            <td className={styles.tablePrice}>EGP {plan.price.toLocaleString()}</td>
                                            <td>
                                                {plan.saleApplied ? (
                                                    <span className={styles.activeSaleBadge}>
                                                        -{plan.discountPercent}%
                                                    </span>
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

                    <button
                        type="button"
                        className={styles.secondaryThemeBtn}
                        onClick={openAddPlanModal}
                    >
                        <FaPlus size={10} /> Add Pricing Plan
                    </button>
                </div>

                {/* 5. Sales & Discounts Card */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Sales & Discounts</h3>

                    {pricingPlans.length === 0 ? (
                        <div className={styles.disabledSalesContainer}>
                            <p className={styles.disabledSalesText}>
                                Add pricing plans first to configure discounts.
                            </p>
                        </div>
                    ) : (
                        <div className={styles.salesAccordionList}>
                            {pricingPlans.map((plan) => {
                                const currentInput = salesData[plan.id] || { discountPercent: "", startDate: "", endDate: "" };
                                const isExpanded = openSaleId === plan.id;

                                // Live calculations
                                const originalPrice = plan.price;
                                const discountPct = parseFloat(currentInput.discountPercent) || 0;
                                // const finalPrice = Math.max(0, originalPrice - (originalPrice * discountPct / 100));
                                // const savings = originalPrice - finalPrice;
                                const finalPrice = Math.round(
                                    Math.max(0, originalPrice - (originalPrice * discountPct / 100))
                                );

                                const savings = originalPrice - finalPrice;

                                return (
                                    <div key={plan.id} className={styles.accordionItem}>
                                        {/* Header */}
                                        <div className={styles.accordionHeader}>
                                            <span className={styles.accordionHeaderText}>
                                                {plan.duration} — E£{plan.price.toLocaleString()}
                                            </span>
                                            <button
                                                type="button"
                                                className={styles.addSaleToggleBtn}
                                                onClick={() => toggleSaleDropdown(plan.id)}
                                            >
                                                <FaBolt className={styles.boltIcon} /> Add Sale
                                            </button>
                                        </div>

                                        {/* Dropdown Panel */}
                                        <div className={`${styles.accordionPanel} ${isExpanded ? styles.expanded : ""}`}>
                                            <div className={styles.accordionPanelContent}>

                                                <div className={styles.salesFieldsRow}>
                                                    <div className={styles.formGroup} style={{ flex: 1 }}>
                                                        <label className={styles.label}>Discount %</label>
                                                        <input
                                                            type="text"
                                                            className={styles.input}
                                                            placeholder="10"
                                                            min={0}
                                                            max={100}
                                                            value={currentInput.discountPercent}
                                                            onChange={(e) => handleSalesInputChange(plan.id, "discountPercent", e.target.value)}
                                                        />
                                                    </div>

                                                    <div className={styles.formGroup} style={{ flex: 1 }}>
                                                        <label className={styles.label}>Start Date</label>
                                                        <div className={styles.datepickerWrapper}>
                                                            <input
                                                                type="date"
                                                                className={styles.dateInput}
                                                                value={currentInput.startDate}
                                                                onClick={(e) => {
                                                                    try { e.target.showPicker(); } catch (err) { }
                                                                }}
                                                                onChange={(e) => handleSalesInputChange(plan.id, "startDate", e.target.value)}
                                                            />
                                                            <FaCalendarAlt className={styles.dateIcon} />
                                                        </div>
                                                    </div>

                                                    <div className={styles.formGroup} style={{ flex: 1 }}>
                                                        <label className={styles.label}>End Date</label>
                                                        <div className={styles.datepickerWrapper}>
                                                            <input
                                                                type="date"
                                                                className={styles.dateInput}
                                                                value={currentInput.endDate}
                                                                onClick={(e) => {
                                                                    try { e.target.showPicker(); } catch (err) { }
                                                                }}
                                                                onChange={(e) => handleSalesInputChange(plan.id, "endDate", e.target.value)}
                                                            />
                                                            <FaCalendarAlt className={styles.dateIcon} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Calculation Summary Row */}
                                                <div className={styles.calcSummaryBox}>
                                                    <div className={styles.calcItem}>
                                                        <span className={styles.calcLabel}>Original</span>
                                                        <span className={styles.calcValueOriginal}>
                                                            EGP {originalPrice.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className={styles.calcItem}>
                                                        <span className={styles.calcLabel}>Discount</span>
                                                        <span className={styles.calcValueDiscount}>
                                                            -{discountPct}%
                                                        </span>
                                                    </div>
                                                    <div className={styles.calcItem}>
                                                        <span className={styles.calcLabel}>Final</span>
                                                        <span className={styles.calcValueFinal}>
                                                            {/* EGP {Math.round(finalPrice).toLocaleString()} */}
                                                            EGP {finalPrice.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className={styles.calcItem}>
                                                        <span className={styles.calcLabel}>Savings</span>
                                                        <span className={styles.calcValueSavings}>
                                                            {/* EGP {Math.round(savings).toLocaleString()} */}
                                                            EGP {savings.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className={styles.applySaleActionRow}>
                                                    <button
                                                        type="button"
                                                        className={styles.applySaleBtn}
                                                        onClick={() => handleApplySale(plan.id)}
                                                    >
                                                        Apply Sale
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
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
                        type="button"
                        className={styles.primaryThemeBtn}
                        onClick={handleCreateService}
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
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleAddPricingPlan}>
                            <div className={styles.formGroup} style={{ marginBottom: "20px" }}>
                                <label className={styles.label}>Duration</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="e.g. 30 Days"
                                    required
                                    value={newPlanDuration}
                                    onChange={(e) => setNewPlanDuration(e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup} style={{ marginBottom: "24px" }}>
                                <label className={styles.label}>
                                    Price <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.priceInputWrapper}>
                                    <span className={styles.currencyPrefix}>E£</span>
                                    <input
                                        type="text"
                                        className={styles.priceInput}
                                        placeholder="5000"
                                        required
                                        min={1}
                                        value={newPlanPrice}
                                        onChange={(e) => setNewPlanPrice(e.target.value)}
                                    />
                                </div>
                            </div>

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