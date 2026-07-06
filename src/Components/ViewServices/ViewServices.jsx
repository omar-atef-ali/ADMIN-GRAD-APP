import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import style from "./ViewServices.module.css";
import api from "../../api";

export default function ViewServies() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getDurationSubtitle = (days) => {
    if (days === 30) return "Monthly";
    if (days === 90) return "Quarterly";
    if (days === 365) return "Annual";
    if (days === 7) return "Weekly";
    return "Custom Duration";
  };
  useEffect(() => {
    async function fetchService() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await api.get(`/admin/services/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(data);
        setService(data);

      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.errors[1] ||
          "Failed to fetch service.",
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

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className={style.overlay}>
        <div className={style.spinner}></div>
      </div>
    );
  }

  return (
    <div className={style.viewPage}>
      {/* Top Breadcrumb & Title Area */}
      <div className={style.headerArea}>
        <div className={style.headerLeft}>
          <Link to="/dashboard/services" className={style.backBtn}>
            <i class="fa-solid fa-arrow-left"></i>
          </Link>
          <div className={style.titleMeta}>

            <div className={style.titleRow}>
              <h1 className={`${style.mainTitle} `}>{service.name}</h1>
              <span className={`${style.statusBadge} ${service.status === "Active" ? style.activeBadge : style.inactiveBadge}`}>
                <span className={style.dot}></span> {service.status}
              </span>
            </div>
          </div>
        </div>
        <button className={style.editBtn} onClick={() => navigate(`/dashboard/services/${id}/edit`)}>
          <i className="fa-regular fa-pen-to-square"></i>
          <span>Edit Service</span>
        </button>
      </div>

      <div className={style.cardsContainer}>
        {/* Card 1: Basic Information */}
        <section className={style.detailsCard}>
          <h2 className={`${style.cardTitle} totalFont`}>Basic Information</h2>
          <div className={style.infoGrid}>
            <div className={style.gridItemHalf}>
              <label className={style.infoLabel}>Service Name</label>
              <p className={style.infoValue} style={{ "fontWeight": "600" }}>{service.name}</p>
            </div>
            <div className={style.gridItemHalf}>
              <label className={style.infoLabel}>Subtitle</label>
              <p className={style.infoValueDescription}>{service.subTitle}</p>
            </div>
            <div className={style.gridItemFull}>
              <label className={style.infoLabel}>Description</label>
              <p className={style.infoValueDescription}>{service.description}</p>
            </div>
            <div className={style.gridItemThird}>
              <label className={style.infoLabel}>Priority</label>
              <div className={style.priorityBox}>
                <span>{service.priority}</span>
              </div>
            </div>
            <div className={style.gridItemThird}>
              <label className={style.infoLabel}>Status</label>
              <p className={style.statusValue}>
                <span className={style.greenDot}></span> {service.status}
              </p>
            </div>
            <div className={style.gridItemThird}>
              <label className={style.infoLabel}>Last Updated</label>
              <p className={style.infoValue}>
                {service.lastUpdated ? new Date(service.lastUpdated).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }) : "N/A"}
              </p>
            </div>
          </div>
        </section>

        {/* Card 2: Key Benefits */}
        <section className={style.detailsCard}>
          <div className={style.cardHeaderRow}>
            <h2 className={`${style.cardTitle} totalFont`}>Key Benefits</h2>
            <span className={style.countBadge}>benefits</span>
          </div>
          <div className={style.benefitsList}>
            {service.keyBenefits?.map((benefit, index) => (
              <div key={index} className={style.benefitRow}>
                <span className={style.checkIcon}>✓</span>
                <span className={style.benefitText}>
                  {typeof benefit === "object" && benefit !== null
                    ? (benefit.text || benefit.benefit || "")
                    : benefit}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Card 3: Pricing Plans */}
        <section className={style.detailsCard}>
          <div className={style.cardHeaderRow}>
            <h2 className={`${style.cardTitle} totalFont`}>Pricing Plans</h2>
            <span className={style.countBadge}>{service.pricingPlans?.length || 0} plans</span>
          </div>
          <div className={style.plansList}>
            {service.pricingPlans?.map((plan) => {
              const hasSale = (plan.sales && plan.sales.length > 0) || plan.isOnSale;
              const sale = plan.sales && plan.sales.length > 0 ? plan.sales[0] : null;
              const discountPercentage = sale ? sale.discountPercentage : (plan.discountPercentage || 0);
              const startDate = sale ? sale.startDate : plan.saleStartDate;
              const endDate = sale ? sale.endDate : plan.saleEndDate;
              const originalPrice = plan.originalPrice || plan.price || 0;
              const savings = originalPrice * (discountPercentage / 100);
              const currentPrice = originalPrice - savings;
              const tokenCount = plan.tokens?.length || 0;

              return (
                <div key={plan.id} className={style.planCard}>
                  {/* Plan Main Header */}
                  <div className={style.planHeaderRow}>
                    <div className={style.planHeaderLeft}>
                      <div className={style.planDurationBadge}>
                        {plan.durationInDays}d
                      </div>
                      <div className={style.planMeta}>
                        <h4 className={style.planName}>{plan.durationInDays} Days</h4>
                        <span className={style.planSubtitle}>
                          {getDurationSubtitle(plan.durationInDays)}
                        </span>
                      </div>
                    </div>

                    <div className={style.planStatsRow}>
                      <div className={style.statCol}>
                        <span className={style.statLabel}>Service Price</span>
                        <span className={style.statValueBold}>EGP {originalPrice.toLocaleString()}</span>
                      </div>
                      <div className={style.statCol}>
                        <span className={style.statLabel}>Token Packages</span>
                        <span className={style.statValueBold}>{tokenCount}</span>
                      </div>
                      {hasSale && discountPercentage > 0 && (
                        <div className={style.statCol}>
                          <span className={style.statLabel}>Sale</span>
                          <span className={style.saleLabelBadge}>{discountPercentage}% off</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Token Packages Rows */}
                  {tokenCount > 0 && (
                    <div className={style.planTokensList}>
                      {plan.tokens.map((tok, tIdx) => (
                        <div key={tok.id || tIdx} className={style.planTokenRow}>
                          <div className={style.tokenRowLeft}>
                            <span className={style.tokenBoltIcon}>
                              <i className="fa-solid fa-bolt"></i>
                            </span>
                            <span className={style.tokenAmountText}>
                              {(tok.amount || 0).toLocaleString()} tokens
                            </span>
                          </div>
                          <span className={style.tokenPriceText}>
                            EGP {(tok.price || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Active Sale Banner Row */}
                  {hasSale && discountPercentage > 0 && (
                    <div className={style.saleBannerRow}>
                      <div className={style.saleBannerLeft}>
                        <span className={style.bannerSaleBadge}>
                          <i className="fa-solid fa-bolt" style={{ fontSize: "10px" }}></i> {discountPercentage}% off
                        </span>
                        <span className={style.saleDatesText}>
                          {formatDateForDisplay(startDate)} → {formatDateForDisplay(endDate)}
                        </span>
                      </div>
                      <div className={style.saleBannerRight}>
                        <span className={style.bannerOriginalPrice}>EGP {originalPrice.toLocaleString()}</span>
                        <span className={style.bannerFinalPrice}>EGP {currentPrice.toLocaleString()}</span>
                        <span className={style.bannerSavingsAmount}>-EGP {savings.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
