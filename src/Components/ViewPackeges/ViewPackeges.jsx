import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import style from "./ViewPackeges.module.css";
import api from "../../api";

export default function ViewPackeges() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchPackage() {
      if (!id) {
        // If no ID is provided, use mock Starter data directly
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await api.get(`/admin/packages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Package data received:", data);
        setPkg(data);
      } catch (error) {
        console.log("Failed to fetch package", error);
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
    }

    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className={style.overlay}>
        <div className={style.spinner}></div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className={style.errorContainer}>
        <h3>Package not found</h3>
        <Link to="/dashboard/packages" className={style.backLinkBtn}>Go Back</Link>
      </div>
    );
  }

  // Calculate active sale status
  const hasActiveSale = pkg.currentSale && typeof pkg.currentSale === "object" && pkg.currentSale.status === "Active";

  // Calculate pricing values
  const originalVal = pkg.price || 0;
  const discountPercentage = hasActiveSale ? (pkg.currentSale.discountPercentage || 0) : 0;
  const currentVal = hasActiveSale
    ? Math.round(originalVal * (1 - discountPercentage / 100))
    : originalVal;
  const savingsAmount = originalVal - currentVal;

  const statusText = pkg.status || (pkg.isActive ? "Active" : "Inactive");

  // Format dates helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get active services array safely
  const servicesList = pkg.services || pkg.includedServices || [];

  // Filter inactive sales
  const inactiveSales = (pkg.sales || []).filter(sale => sale.status !== "Active");

  return (
    <div className={style.viewPage}>
      {/* Top Breadcrumb & Title Area */}
      <div className={style.headerArea}>
        <div className={style.headerLeft}>
          <button onClick={() => navigate(-1)} className={style.backBtn}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className={style.titleMeta}>
            <div className={style.breadcrumbs}>
              <span>Packages</span>
              <span className={style.divider}>/</span>
              <span className={style.activePath}>{pkg.name}</span>
            </div>
            <div className={style.titleRow}>
              <h1 className={style.mainTitle}>{pkg.name}</h1>
              <span className={`${style.statusBadge} ${statusText === "Active" ? style.activeBadge : style.inactiveBadge}`}>
                <span className={style.dot}></span> {statusText}
              </span>
            </div>
          </div>
        </div>
        <button className={style.editBtn} onClick={() => navigate(`/dashboard/packages/${pkg.id}/edit`)}>
          <i className="fa-regular fa-pen-to-square"></i>
          <span>Edit Package</span>
        </button>
      </div>

      <div className={style.cardsContainer}>
        {/* Card 1: Package Information */}
        <section className={style.detailsCard}>
          <h2 className={`${style.cardTitle} totalFont`}>Package Information</h2>
          <div className={style.infoGrid}>
            <div className={style.gridItemHalf}>
              <label className={style.infoLabel}>Package Name</label>
              <p className={style.infoValue} style={{ fontWeight: "600" }}>{pkg.name}</p>
            </div>
            <div className={style.gridItemHalf}>
              <label className={style.infoLabel}>Package Level</label>
              <p className={style.infoValue}>{pkg.packageLevel || ""}</p>
            </div>
            <div className={style.gridItemFull}>
              <label className={style.infoLabel}>Description</label>
              <p className={style.infoValueDescription}>{pkg.description}</p>
            </div>
            <div className={style.gridItemFourth}>
              <label className={style.infoLabel}>Duration</label>
              <p className={style.infoValue} style={{ fontWeight: "600" }}>{pkg.durationInDays} Days</p>
            </div>
            <div className={style.gridItemFourth}>
              <label className={style.infoLabel}>Priority</label>
              <div className={style.priorityBox}>
                <span>{pkg.priority}</span>
              </div>
            </div>
            <div className={style.gridItemFourth}>
              <label className={style.infoLabel}>Status</label>
              <p className={style.statusValue}>
                <span className={style.greenDot}></span> {statusText}
              </p>
            </div>
          </div>
        </section>

        {/* Card 2: Pricing */}
        <section className={style.detailsCard}>
          <h2 className={`${style.cardTitle} totalFont`}>Current Pricing</h2>
          <div className={style.pricingGrid}>
            {/* Base Price */}
            <div className={style.pricingBlock}>
              <label className={style.infoLabel}>Base Price</label>
              <div className={style.basePriceVal}>EGP {originalVal.toLocaleString()}</div>
              <span className={style.perText}>per {pkg.durationInDays || 30} days</span>
            </div>

            {/* Active Sale Badge */}
            <div className={style.pricingBlock} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              {hasActiveSale && (
                <>
                  <label className={style.infoLabel}>Active Sale</label>
                  <div className={style.saleTag}>
                    <i className="fa-solid fa-percent" style={{ fontSize: "10px", marginRight: "4px" }}></i>
                    {discountPercentage}% Off
                  </div>
                </>
              )}
            </div>

            {/* Discounted Price Details */}
            <div className={style.pricingBlockRight}>
              {hasActiveSale ? (
                <>
                  <div className={style.currentPriceVal}>EGP {currentVal.toLocaleString()}</div>
                  <div className={style.saleDates}>
                    {formatDate(pkg.currentSale.startDate)} — {formatDate(pkg.currentSale.endDate)}
                  </div>
                  {savingsAmount > 0 && (
                    <div className={style.savingsTag}>
                      Savings: EGP {savingsAmount.toLocaleString()}
                    </div>
                  )}
                </>
              ) : (
                <div className={style.currentPriceVal}>EGP {originalVal.toLocaleString()}</div>
              )}
            </div>
          </div>
        </section>

        {/* Card: Old Sales */}
        {inactiveSales.length > 0 && (
          <section className={style.detailsCard}>
            <div className={style.cardHeaderRow}>
              <h2 className={`${style.cardTitle} totalFont`}>Old Sales</h2>
              <span className={style.countBadge}>{inactiveSales.length} past sales</span>
            </div>
            <div className={style.servicesList}>
              {inactiveSales.map((sale, index) => {
                const saleDiscount = sale.discountPercentage || 0;
                const salePrice = Math.round(originalVal * (1 - saleDiscount / 100));

                return (
                  <div key={sale.id || index} className={style.serviceRow}>
                    <div className={style.serviceLeft}>
                      <div className={style.serviceAvatar} style={{ backgroundColor: "#FAF8F6", color: "#838282" }}>
                        <i className="fa-solid fa-percent" style={{ fontSize: "14px" }}></i>
                      </div>
                      <div className={style.serviceMeta}>
                        <h4 className={style.serviceName}>{saleDiscount}% Off</h4>
                        <p className={style.serviceDesc}>
                          {formatDate(sale.startDate)} — {formatDate(sale.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className={style.serviceRight} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      <span className={style.inactiveBadge} style={{ fontSize: "11px", padding: "4px 10px" }}>
                        {sale.status || "Inactive"}
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#6C7383" }}>
                        EGP {salePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Card 3: Included Services */}
        <section className={style.detailsCard}>
          <div className={style.cardHeaderRow}>
            <h2 className={`${style.cardTitle} totalFont`}>Included Services</h2>
            <span className={style.countBadge}>{servicesList.length} services</span>
          </div>
          <div className={style.servicesList}>
            {servicesList.map((service, index) => {
              const firstLetter = service.name ? service.name.charAt(0).toUpperCase() : "S";

              // Resolve token allocation
              const rawTokens = service.tokenAmount !== undefined ? service.tokenAmount : (service.limitValue !== undefined ? service.limitValue : 0);
              const numericTokens = Number(rawTokens);
              const isUnlimited = service.name?.toLowerCase() === "dashboard" || isNaN(numericTokens) || numericTokens === 0;

              return (
                <div key={service.id || index} className={style.serviceRow}>
                  <div className={style.serviceLeft}>
                    <div className={style.serviceAvatar}>
                      {firstLetter}
                    </div>
                    <div className={style.serviceMeta}>
                      <h4 className={style.serviceName}>{service.name}</h4>
                      <p className={style.serviceDesc}>{service.description || service.subTitle}</p>
                    </div>
                  </div>
                  <div className={style.serviceRight}>
                    {isUnlimited ? (
                      <span className={style.unlimitedBadge}>
                        <i className="fa-solid fa-star" style={{ fontSize: "10px", marginRight: "4px" }}></i>
                        Unlimited
                      </span>
                    ) : (
                      <span className={style.tokenBadge}>
                        <i className="fa-solid fa-gem" style={{ fontSize: "10px", marginRight: "4px" }}></i>
                        {numericTokens.toLocaleString()} tokens
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
