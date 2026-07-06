import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import style from "./EditServices.module.css";
import api from "../../api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FaArrowLeft
} from "react-icons/fa";
import { userContext } from "../../context/userContext";

export default function EditServies() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceDetails, setServiceDetails] = useState({});

  const { userToken } = useContext(userContext);

  // File input refs
  const imageInputRef = useRef(null);
  const iconInputRef = useRef(null);

  // Accordion UI state
  const [openDiscountPlanId, setOpenDiscountPlanId] = useState(null);
  const [openPlanId, setOpenPlanId] = useState(null);
  const [newBenefitText, setNewBenefitText] = useState("");

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      subTitle: "",
      description: "",
      priority: 1,
      status: "Active",
      image: null,
      icon: null,
      keyBenefits: [],
      pricingPlans: []
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Service Name is required")
        .max(100, "Service Name must be 100 characters or less"),
      subTitle: Yup.string()
        .required("Subtitle is required")
        .max(150, "Subtitle must be 150 characters or less"),
      description: Yup.string()
        .max(500, "Description must be 500 characters or less"),
      priority: Yup.number()
        .required("Priority is required")
        .min(1, "Priority must be at least 1"),
      status: Yup.string().required("Status is required"),
      pricingPlans: Yup.array().of(
        Yup.object().shape({
          durationInDays: Yup.number()
            .required("Duration is required")
            .min(1, "Duration must be at least 1 day"),
          originalPrice: Yup.number()
            .required("Price is required")
            .min(0, "Price cannot be negative"),
          discountPercentage: Yup.number()
            .nullable()
            .min(0, "Discount cannot be negative")
            .max(100, "Discount cannot exceed 100%"),
          saleStartDate: Yup.string().test("start-date-req", "Sale start date is required", function (val) {
            return this.parent.isOnSale ? !!val : true;
          }),
          saleEndDate: Yup.string()
            .test("end-date-req", "Sale end date is required", function (val) {
              return this.parent.isOnSale ? !!val : true;
            })
            .test("end-date-after-start", "End Date must be after Start Date", function (val) {
              const { saleStartDate, isOnSale } = this.parent;
              if (isOnSale && saleStartDate && val) {
                return new Date(val) > new Date(saleStartDate);
              }
              return true;
            }),
          tokens: Yup.array().of(
            Yup.object().shape({
              amount: Yup.number()
                .required("Amount is required")
                .min(1, "Amount must be at least 1"),
              price: Yup.number()
                .required("Price is required")
                .min(0, "Price cannot be negative")
            })
          )
        })
      )
    }),
    onSubmit: async (values) => {
      try {
        setSaving(true);
        const formData = new FormData();
        formData.append("Name", values.name);
        formData.append("SubTitle", values.subTitle);
        formData.append("Description", values.description);
        formData.append("Priority", (parseInt(values.priority) || 1).toString());
        formData.append("IsActive", (values.status === "Active") ? "True" : "False");

        if (values.image instanceof File) {
          formData.append("Image", values.image);
        }
        if (values.icon instanceof File) {
          formData.append("Icon", values.icon);
        }

        // KeyBenefits
        if (values.keyBenefits && values.keyBenefits.length > 0) {
          values.keyBenefits.forEach((benefit, index) => {
            if (benefit.id) {
              formData.append(`KeyBenefits[${index}].Id`, benefit.id.toString());
            }
            formData.append(`KeyBenefits[${index}].Text`, benefit.text || "");
            formData.append(`KeyBenefits[${index}].Priority`, (benefit.priority || (index + 1)).toString());
          });
        }

        // Prices
        if (values.pricingPlans && values.pricingPlans.length > 0) {
          values.pricingPlans.forEach((plan, planIndex) => {
            const planId = Number(plan.id);
            if (plan.id && !isNaN(planId) && planId > 0 && !String(plan.id).includes('.')) {
              formData.append(`Prices[${planIndex}].Id`, planId.toString());
            }
            formData.append(`Prices[${planIndex}].DurationInDays`, (parseInt(plan.durationInDays) || 30).toString());

            const planPrice = parseFloat(plan.originalPrice) || 0;
            formData.append(`Prices[${planIndex}].Price`, planPrice.toString());

            // Tokens
            const tokens = plan.tokens || [];
            if (tokens.length > 0) {
              tokens.forEach((token, tokenIndex) => {
                if (token.id) {
                  formData.append(`Prices[${planIndex}].Tokens[${tokenIndex}].Id`, token.id.toString());
                }
                formData.append(`Prices[${planIndex}].Tokens[${tokenIndex}].Amount`, (parseInt(token.amount) || 0).toString());
                formData.append(`Prices[${planIndex}].Tokens[${tokenIndex}].Price`, (parseFloat(token.price) || 0).toString());
              });
            } else {
              formData.append(`Prices[${planIndex}].Tokens[0].Amount`, "0");
              formData.append(`Prices[${planIndex}].Tokens[0].Price`, "0");
            }

            // Sales
            if (plan.isOnSale) {
              const discountPercentage = parseFloat(plan.discountPercentage) || 0;
              const startDate = plan.saleStartDate ? (plan.saleStartDate.includes('T') ? plan.saleStartDate : `${plan.saleStartDate}T00:00:00.000Z`) : new Date().toISOString();
              const endDate = plan.saleEndDate ? (plan.saleEndDate.includes('T') ? plan.saleEndDate : `${plan.saleEndDate}T23:59:59.000Z`) : new Date().toISOString();

              if (plan.saleId) {
                formData.append(`Prices[${planIndex}].Sales[0].Id`, plan.saleId.toString());
              }
              formData.append(`Prices[${planIndex}].Sales[0].DiscountPercentage`, discountPercentage.toString());
              formData.append(`Prices[${planIndex}].Sales[0].StartDate`, startDate);
              formData.append(`Prices[${planIndex}].Sales[0].EndDate`, endDate);
            }
          });
        }

        await api.put(`/admin/services/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data"
          }
        });

        Swal.fire({
          title: "Success!",
          text: "Service updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(`/dashboard/services/${id}`);

      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.errors?.[1] || "Failed to update service.",
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
        setSaving(false);
      }
    }
  });

  async function getService() {
    try {
      setLoading(true);

      const { data } = await api.get(`/admin/services/${id}`,
        { headers: { Authorization: `Bearer ${userToken}` } });
      console.log(data);
      if (data) {
        setServiceDetails(data);
        formik.setValues({
          name: data.name || "",
          subTitle: data.subTitle || "",
          description: data.description || "",
          priority: data.priority || 1,
          status: data.status || "Active",
          image: data.imageURL || null,
          icon: data.iconURL || null,
          keyBenefits: data.keyBenefits ? data.keyBenefits.map((ben, idx) => {
            if (typeof ben === 'object' && ben !== null) {
              return {
                id: ben.id || null,
                text: ben.text || ben.benefit || "",
                priority: ben.priority || (idx + 1)
              };
            }
            return {
              id: null,
              text: ben,
              priority: idx + 1
            };
          }) : [],
          pricingPlans: data.pricingPlans ? data.pricingPlans.map(plan => {
            const hasSale = plan.sales && plan.sales.length > 0;
            const sale = hasSale ? plan.sales[0] : null;
            const originalPrice = plan.originalPrice || plan.price || 0;
            const discountPercentage = sale ? (sale.discountPercentage || 0) : (plan.discountPercentage || 0);
            const currentPrice = (hasSale || plan.isOnSale) ? Math.max(0, originalPrice - (originalPrice * discountPercentage / 100)) : (plan.currentPrice || originalPrice);

            return {
              id: plan.id || Math.random().toString(36).substr(2, 9),
              durationInDays: plan.durationInDays || 30,
              originalPrice: originalPrice,
              currentPrice: currentPrice,
              isOnSale: hasSale || plan.isOnSale || false,
              saleId: sale ? sale.id : (plan.saleId || null),
              discountPercentage: discountPercentage,
              saleStartDate: formatDateForInput(sale ? sale.startDate : plan.saleStartDate),
              saleEndDate: formatDateForInput(sale ? sale.endDate : plan.saleEndDate),
              tokens: plan.tokens ? plan.tokens.map(tok => ({
                id: tok.id || null,
                amount: tok.amount || 0,
                price: tok.price || 0
              })) : []
            };
          }) : []
        });
        if (data.pricingPlans && data.pricingPlans.length > 0) {
          setOpenPlanId(data.pricingPlans[0].id);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.errors[1] ||
        "Something went wrong .",
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
      setLoading(false);
    }
  }

  useEffect(() => {
    getService();
  }, []);

  // Handle file drops & selections
  const handleFileChange = (e, target) => {
    const file = e.target.files[0];
    if (file) {
      if (target === "image") {
        formik.setFieldValue("image", file);
      } else {
        formik.setFieldValue("icon", file);
      }
    }
  };

  // Trigger file inputs
  const triggerFileInput = (target) => {
    if (target === "image") {
      imageInputRef.current?.click();
    } else {
      iconInputRef.current?.click();
    }
  };

  // Remove uploaded file
  const removeFile = (e, target) => {
    e.stopPropagation();
    if (target === "image") {
      formik.setFieldValue("image", null);
      if (imageInputRef.current) imageInputRef.current.value = "";
    } else {
      formik.setFieldValue("icon", null);
      if (iconInputRef.current) iconInputRef.current.value = "";
    }
  };

  // Benefits handlers
  const handleBenefitChange = (index, value) => {
    const updated = [...formik.values.keyBenefits];
    updated[index] = { ...updated[index], text: value };
    formik.setFieldValue("keyBenefits", updated);
  };

  const deleteBenefit = (index) => {
    const updated = formik.values.keyBenefits.filter((_, i) => i !== index);
    formik.setFieldValue("keyBenefits", updated);
  };

  const addBenefit = () => {
    if (newBenefitText.trim() === "") return;
    const newBen = {
      id: null,
      text: newBenefitText.trim(),
      priority: formik.values.keyBenefits.length + 1
    };
    formik.setFieldValue("keyBenefits", [...formik.values.keyBenefits, newBen]);
    setNewBenefitText("");
  };

  const handleBenefitKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addBenefit();
    }
  };

  // Pricing Plans handlers
  const handlePlanChange = (id, field, value) => {
    const updatedPlans = formik.values.pricingPlans?.map(plan => {
      if (plan.id === id) {
        const updated = { ...plan, [field]: value };
        if (field === "originalPrice") {
          const orig = parseFloat(value) || 0;
          if (!updated.isOnSale) {
            updated.currentPrice = orig;
          } else {
            const pct = parseFloat(updated.discountPercentage) || 0;
            updated.currentPrice = Math.max(0, orig - (orig * pct / 100));
          }
        } else if (field === "discountPercentage" || field === "isOnSale") {
          const orig = parseFloat(updated.originalPrice) || 0;
          const pct = parseFloat(updated.discountPercentage) || 0;
          if (updated.isOnSale) {
            updated.currentPrice = Math.max(0, orig - (orig * pct / 100));
          } else {
            updated.currentPrice = orig;
          }
        }
        return updated;
      }
      return plan;
    });
    formik.setFieldValue("pricingPlans", updatedPlans);
  };

  const handleResetSale = (planId) => {
    const updatedPlans = formik.values.pricingPlans?.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          isOnSale: false,
          discountPercentage: 0,
          saleStartDate: "",
          saleEndDate: "",
          sales: [],
          currentPrice: plan.originalPrice || 0
        };
      }
      return plan;
    });
    formik.setFieldValue("pricingPlans", updatedPlans);
    setOpenDiscountPlanId(null);
  };

  const handleAddSaleToggle = (planId) => {
    const isAlreadyOpen = openDiscountPlanId === planId;
    if (isAlreadyOpen) {
      setOpenDiscountPlanId(null);
    } else {
      const updatedPlans = formik.values.pricingPlans?.map(plan => {
        if (plan.id === planId) {
          return {
            ...plan,
            isOnSale: true
          };
        }
        return plan;
      });
      formik.setFieldValue("pricingPlans", updatedPlans);
      setOpenDiscountPlanId(planId);
    }
  };

  const deletePlan = (planId) => {
    formik.setFieldValue("pricingPlans", formik.values.pricingPlans.filter(p => p.id !== planId));
    if (openPlanId === planId) {
      setOpenPlanId(null);
    }
  };

  const handleTokenChange = (planId, tokenIndex, field, value) => {
    const updatedPlans = formik.values.pricingPlans?.map(plan => {
      if (plan.id === planId) {
        const updatedTokens = [...(plan.tokens || [])];
        updatedTokens[tokenIndex] = {
          ...updatedTokens[tokenIndex],
          [field]: value
        };
        return { ...plan, tokens: updatedTokens };
      }
      return plan;
    });
    formik.setFieldValue("pricingPlans", updatedPlans);
  };

  const addTokenPackage = (planId) => {
    const updatedPlans = formik.values.pricingPlans?.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          tokens: [...(plan.tokens || []), { id: null, amount: 0, price: 0 }]
        };
      }
      return plan;
    });
    formik.setFieldValue("pricingPlans", updatedPlans);
  };

  const deleteTokenPackage = (planId, tokenIndex) => {
    const updatedPlans = formik.values.pricingPlans?.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          tokens: (plan.tokens || []).filter((_, idx) => idx !== tokenIndex)
        };
      }
      return plan;
    });
    formik.setFieldValue("pricingPlans", updatedPlans);
  };

  const addPricingPlan = () => {
    const newPlan = {
      id: Math.random().toString(36).substr(2, 9),
      durationInDays: 30,
      originalPrice: 0,
      currentPrice: 0,
      isOnSale: false,
      saleId: null,
      discountPercentage: 0,
      saleStartDate: "",
      saleEndDate: "",
      tokens: [
        {
          amount: 0,
          price: 0
        }
      ]
    };
    formik.setFieldValue("pricingPlans", [...formik.values.pricingPlans, newPlan]);
  };

  // Calculate discounts preview values
  const calculatePreviewValues = (plan) => {
    const originalPrice = parseFloat(plan.originalPrice) || 0;
    const discountPct = parseFloat(plan.discountPercentage) || 0;
    const discountAmount = originalPrice * (discountPct / 100);
    const finalPrice = Math.max(0, originalPrice - discountAmount);

    return {
      originalPrice,
      discountPct,
      finalPrice: finalPrice,
      savings: discountAmount
    };
  };

  if (loading) {
    return (
      <div className={style.overlay}>
        <div className={style.spinner}></div>
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} className={style.editPage}>
      {/* Top Header & Breadcrumbs */}
      <div className={style.breadcrumbHeader}>
        <div className={style.breadcrumbRow}>
          <button
            type="button"
            className={style.backBtn}
            onClick={() => navigate(-1)}
            title="Back to Services"
          >
            <FaArrowLeft />
          </button>
          <span className={style.breadcrumbLink} onClick={() => navigate(-1)}>Services</span>
          <span className={style.breadcrumbSeparator}>/</span>
          <span className={style.breadcrumbActive}>Edit Service</span>
        </div>
        <h1 className={style.pageTitle}>Edit {serviceDetails.name}</h1>
      </div>

      <div className={style.cardsContainer}>
        {/* Card 1: Basic Information */}
        <section className={style.detailsCard}>
          <h2 className={style.cardTitle}>Basic Information</h2>
          <div className={style.infoGrid}>
            <div className={style.gridItemHalf}>
              <div className={style.inputGroup}>
                <label className={style.infoLabel}>Service Name<span style={{ color: "#ED5A6A", marginLeft: "5px" }}>*</span></label>
                <input
                  type="text"
                  name="name"
                  className={style.inputField}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. AI Recommendation"
                />
                {formik.touched.name && formik.errors.name && (
                  <div className={style.errorMessage}>{formik.errors.name}</div>
                )}
              </div>
            </div>
            <div className={style.gridItemHalf}>
              <div className={style.inputGroup}>
                <label className={style.infoLabel}>Subtitle<span style={{ color: "#ED5A6A", marginLeft: "5px" }}>*</span></label>
                <input
                  type="text"
                  name="subTitle"
                  className={style.inputField}
                  value={formik.values.subTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Personalized AI-driven recommendations"
                />
                {formik.touched.subTitle && formik.errors.subTitle && (
                  <div className={style.errorMessage}>{formik.errors.subTitle}</div>
                )}
              </div>
            </div>
            <div className={style.gridItemFull}>
              <div className={style.inputGroup}>
                <label className={style.infoLabel}>Description</label>
                <textarea
                  name="description"
                  className={style.inputField}
                  style={{ minHeight: "100px", resize: "vertical" }}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Describe your service in detail..."
                />
                {formik.touched.description && formik.errors.description && (
                  <div className={style.errorMessage}>{formik.errors.description}</div>
                )}
              </div>
            </div>
            <div className={style.gridItemHalf}>
              <div className={style.inputGroup}>
                <label className={style.infoLabel}>Priority</label>
                <input
                  type="number"
                  name="priority"
                  className={style.inputField}
                  value={formik.values.priority}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  min="1"
                  max="100"
                />
                {formik.touched.priority && formik.errors.priority && (
                  <div className={style.errorMessage}>{formik.errors.priority}</div>
                )}
              </div>
            </div>
            <div className={style.gridItemHalf}>
              <div className={style.inputGroup}>
                <label className={style.infoLabel}>Status</label>
                <div className={style.statusSwitchWrapper}>
                  <label className={style.switch}>
                    <input
                      type="checkbox"
                      checked={formik.values.status === "Active"}
                      onChange={(e) => formik.setFieldValue("status", e.target.checked ? "Active" : "Inactive")}
                    />
                    <span className={style.slider}></span>
                  </label>
                  <span className={`${style.statusLabel} ${formik.values.status !== "Active" ? style.inactive : ""}`}>
                    {formik.values.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card 2: Media Assets */}
        <section className={style.detailsCard}>
          <h2 className={style.cardTitle}>Media Assets</h2>
          <div className={style.mediaRow}>
            {/* Service Image */}
            <div className={style.inputGroup}>
              <label className={style.infoLabel}>Service Image</label>
              <div className={style.dropzone} onClick={() => triggerFileInput("image")}>
                <input
                  type="file"
                  ref={imageInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "image")}
                />
                {formik.values.image ? (
                  <div className={style.previewContainer}>
                    <button type="button" className={style.removeFileBtn} onClick={(e) => removeFile(e, "image")}>
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                    <img
                      className={style.previewImg}
                      src={typeof formik.values.image === "string" ? (formik.values.image.startsWith("http") ? formik.values.image : `https://deebai.runasp.net/${formik.values.image}`) : URL.createObjectURL(formik.values.image)}
                      alt="Service"
                    />
                  </div>
                ) : (
                  <>
                    <i className={`fa-regular fa-image ${style.uploadIcon}`}></i>
                    <p className={style.dropzoneText}>
                      Drag and drop or <span>Browse files</span>
                    </p>
                    <p className={style.dropzoneSubtext}>JPEG, PNG, WEBP up to 5MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Service Icon */}
            <div className={style.inputGroup}>
              <label className={style.infoLabel}>Service Icon</label>
              <div className={style.dropzoneSmall} onClick={() => triggerFileInput("icon")}>
                <input
                  type="file"
                  ref={iconInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "icon")}
                />
                {formik.values.icon ? (
                  <div className={style.previewContainer}>
                    <button type="button" className={style.removeFileBtn} onClick={(e) => removeFile(e, "icon")}>
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                    <img
                      className={style.previewImg}
                      src={typeof formik.values.icon === "string" ? (formik.values.icon.startsWith("http") ? formik.values.icon : `https://deebai.runasp.net/${formik.values.icon}`) : URL.createObjectURL(formik.values.icon)}
                      alt="Icon"
                    />
                  </div>
                ) : (
                  <>
                    <i className={`fa-solid fa-circle-nodes ${style.uploadIcon}`}></i>
                    <p className={style.dropzoneText}>
                      Drag and drop or <span>Browse files</span>
                    </p>
                    <p className={style.dropzoneSubtext}>SVG or PNG up to 1MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Card 3: Key Benefits */}
        <section className={style.detailsCard}>
          <h2 className={style.cardTitle}>Key Benefits</h2>
          <div className={style.benefitsList}>
            {formik.values.keyBenefits?.map((benefit, index) => (
              <div key={index} className={style.benefitInputRow}>
                <span className={style.checkIcon}>✓</span>
                <input
                  type="text"
                  className={style.benefitInput}
                  value={benefit.text}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                />
                <button
                  type="button"
                  className={style.deleteBtn}
                  onClick={() => deleteBenefit(index)}
                  title="Remove benefit"
                >
                  <i className="fa-regular fa-trash-can"></i>
                </button>
              </div>
            ))}
          </div>

          <div className={style.addBenefitRow}>
            <input
              type="text"
              className={style.inputField}
              value={newBenefitText}
              onChange={(e) => setNewBenefitText(e.target.value)}
              onKeyPress={handleBenefitKeyPress}
              placeholder="Type benefit text and press enter or click +"
            />
            <button
              type="button"
              className={style.addBenefitBtn}
              onClick={addBenefit}
              title="Add benefit"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        </section>

        {/* Card 4: Pricing Configuration */}
        <section className={style.detailsCard}>
          <div className={style.cardHeaderRow}>
            <h2 className={style.cardTitle}>Pricing Configuration</h2>
          </div>

          <div className={style.plansContainer}>
            {formik.values.pricingPlans?.map((plan, planIndex) => {
              const isOpen = openPlanId === plan.id;
              const tokenCount = plan.tokens?.length || 0;
              const hasSale = plan.isOnSale && plan.discountPercentage;
              const saleText = hasSale ? `${plan.discountPercentage}% off` : "No sale";

              return (
                <div key={plan.id} className={style.planAccordionCard}>
                  {/* Accordion Header */}
                  <div
                    className={style.planAccordionHeader}
                    onClick={() => setOpenPlanId(isOpen ? null : plan.id)}
                  >
                    <div className={style.headerLeft}>
                      <span className={`${style.toggleArrow} ${isOpen ? style.arrowOpen : ""}`}>
                        <i className="fa-solid fa-chevron-down"></i>
                      </span>
                      <div className={style.headerText}>
                        <h3 className={style.planTitle}>{plan.durationInDays || 0} Days</h3>
                        <span className={style.planSubtitle}>
                          {tokenCount} token packages - {saleText}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={style.deletePlanBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlan(plan.id);
                      }}
                    >
                      <i className="fa-regular fa-trash-can"></i> Delete Plan
                    </button>
                  </div>

                  {/* Accordion Body */}
                  {isOpen && (
                    <div className={style.planAccordionBody}>
                      <div className={style.planDetailsSection}>
                        <h4 className={style.sectionSubTitle}>PLAN DETAILS</h4>
                        <div className={style.detailsGrid}>
                          <div className={style.inputGroup}>
                            <label className={style.infoLabel}>Duration</label>
                            <input
                              type="number"
                              className={style.inputField}
                              value={plan.durationInDays}
                              onChange={(e) => handlePlanChange(plan.id, "durationInDays", e.target.value)}
                              placeholder="30"
                            />
                            {formik.errors.pricingPlans?.[planIndex]?.durationInDays && (
                              <div className={style.errorMessage}>{formik.errors.pricingPlans[planIndex].durationInDays}</div>
                            )}
                          </div>
                          <div className={style.inputGroup}>
                            <label className={style.infoLabel}>Service Price</label>
                            <input
                              type="number"
                              className={style.inputField}
                              value={plan.originalPrice}
                              onChange={(e) => handlePlanChange(plan.id, "originalPrice", e.target.value)}
                              placeholder="0"
                            />
                            {formik.errors.pricingPlans?.[planIndex]?.originalPrice && (
                              <div className={style.errorMessage}>{formik.errors.pricingPlans[planIndex].originalPrice}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={style.tokenPackagesSection}>
                        <div className={style.tokenSectionHeader}>
                          <h4 className={style.sectionSubTitle}>TOKEN PACKAGES</h4>
                          <span className={style.packageCountLabel}>{tokenCount} packages</span>
                        </div>

                        <div className={style.tokensList}>
                          {plan.tokens?.map((token, tokenIndex) => (
                            <div key={tokenIndex} className={style.tokenPackageRow}>
                              <div className={style.tokenRowLeft}>
                                <span className={style.boltIcon}>
                                  <i className="fa-solid fa-bolt"></i>
                                </span>
                                <div className={style.tokenInputsContainer}>
                                  <input
                                    type="number"
                                    className={style.tokenAmountInput}
                                    value={token.amount || ""}
                                    onChange={(e) => handleTokenChange(plan.id, tokenIndex, "amount", e.target.value)}
                                    placeholder="10000"
                                  />
                                  <span className={style.tokenText}>tokens</span>
                                  <span className={style.tokenDivider}>|</span>
                                  <input
                                    type="number"
                                    className={style.tokenPriceInput}
                                    value={token.price || ""}
                                    onChange={(e) => handleTokenChange(plan.id, tokenIndex, "price", e.target.value)}
                                    placeholder="200"
                                  />
                                  <span className={style.tokenCurrency}>EGP</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className={style.deleteTokenBtn}
                                onClick={() => deleteTokenPackage(plan.id, tokenIndex)}
                                title="Remove package"
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          className={style.addTokenPkgBtn}
                          onClick={() => addTokenPackage(plan.id)}
                        >
                          <i className="fa-solid fa-plus"></i> Add Token Package
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button type="button" className={style.addPlanBtn} onClick={addPricingPlan}>
            <i className="fa-solid fa-plus"></i> Add Pricing Plan
          </button>
        </section>

        {/* Card 5: Sales & Discounts */}
        <section className={style.detailsCard}>
          <h2 className={style.cardTitle}>Sales & Discounts</h2>
          <p className={style.cardSubtitle}>Apply specific percentage discounts and start/end dates to existing plans.</p>
          <div className={style.salesGrid}>
            {formik.values.pricingPlans?.map((plan, planIndex) => {
              const preview = calculatePreviewValues(plan);
              const originalVal = preview.originalPrice;
              const hasActiveDiscount = plan.isOnSale && plan.discountPercentage;
              const isPanelOpen = openDiscountPlanId === plan.id;

              return (
                <div key={plan.id} className={style.salesCard}>
                  <div
                    className={style.salesHeaderRow}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <h3 className={style.salesCardTitle}>
                        {plan.durationInDays} Days — EGP {originalVal.toLocaleString()}
                      </h3>
                      {hasActiveDiscount && (
                        <span className={style.activeSaleBadge}>
                          {plan.discountPercentage}% off active
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className={style.addSaleBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddSaleToggle(plan.id);
                      }}
                    >
                      <i className="fa-solid fa-bolt" style={{ fontSize: "11px" }}></i>{" "}
                      {hasActiveDiscount ? "Edit Sale" : "Add Sale"}
                    </button>
                  </div>

                  {isPanelOpen && (
                    <div className={style.salesContent}>
                      <div className={style.salesFormRow}>
                        <div className={style.inputGroup}>
                          <label className={style.infoLabel}>Discount %</label>
                          <input
                            type="number"
                            className={style.inputField}
                            value={plan.discountPercentage || ""}
                            onChange={(e) => handlePlanChange(plan.id, "discountPercentage", e.target.value)}
                            placeholder="e.g. 10"
                            min="1"
                            max="100"
                          />
                          {formik.errors.pricingPlans?.[planIndex]?.discountPercentage && (
                            <div className={style.errorMessage}>{formik.errors.pricingPlans[planIndex].discountPercentage}</div>
                          )}
                        </div>
                        <div className={style.inputGroup}>
                          <label className={style.infoLabel}>Start Date</label>
                          <input
                            type="date"
                            className={style.inputField}
                            value={plan.saleStartDate || ""}
                            onChange={(e) => handlePlanChange(plan.id, "saleStartDate", e.target.value)}
                          />
                          {formik.errors.pricingPlans?.[planIndex]?.saleStartDate && (
                            <div className={style.errorMessage}>{formik.errors.pricingPlans[planIndex].saleStartDate}</div>
                          )}
                        </div>
                        <div className={style.inputGroup}>
                          <label className={style.infoLabel}>End Date</label>
                          <input
                            type="date"
                            className={style.inputField}
                            value={plan.saleEndDate || ""}
                            onChange={(e) => handlePlanChange(plan.id, "saleEndDate", e.target.value)}
                          />
                          {formik.errors.pricingPlans?.[planIndex]?.saleEndDate && (
                            <div className={style.errorMessage}>{formik.errors.pricingPlans[planIndex].saleEndDate}</div>
                          )}
                        </div>
                      </div>

                      {/* Math Calculation Live Preview */}
                      <div className={style.salesSummary}>
                        <div className={style.summaryGrid}>
                          <div>
                            <span className={style.summaryLabel}>Original</span>
                            <p className={`${style.summaryValue} ${style.original}`}>
                              EGP {preview.originalPrice.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className={style.summaryLabel}>Discount</span>
                            <p className={`${style.summaryValue} ${style.discount}`}>
                              -{preview.discountPct}%
                            </p>
                          </div>
                          <div>
                            <span className={style.summaryLabel}>Final</span>
                            <p className={`${style.summaryValue} ${style.final}`}>
                              EGP {preview.finalPrice.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className={style.summaryLabel}>Savings</span>
                            <p className={`${style.summaryValue} ${style.savings}`}>
                              EGP {preview.savings.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={style.salesActions}>
                        <button
                          type="button"
                          className={style.removeSaleLink}
                          onClick={() => handleResetSale(plan.id)}
                        >
                          Remove Sale
                        </button>
                        {/* <button
                          type="button"
                          className={style.updateSaleBtn}
                          onClick={() => {
                            handlePlanChange(plan.id, "isOnSale", true);
                            setOpenDiscountPlanId(null);
                          }}
                        >
                          Update Sale
                        </button> */}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Action Footer Buttons */}
        <div className={style.footerButtons}>
          <button
            type="button"
            className={style.cancelBtn}
            onClick={() => navigate(`/dashboard/services/${id}`)}
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className={style.saveBtn} disabled={saving || !formik.isValid}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
