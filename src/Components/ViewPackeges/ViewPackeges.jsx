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
        console.warn("Failed to fetch package from API, falling back to mockup data:", error);
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

  // Calculate savings
  const originalVal = pkg.price || 0;
  const currentVal = pkg.currentPrice || 0;
  const savingsAmount = originalVal - currentVal;

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
  const servicesList = pkg.includedServices || pkg.services || pkg.packageServices || [];

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
              <span className={`${style.statusBadge} ${pkg.status === "Active" ? style.activeBadge : style.inactiveBadge}`}>
                <span className={style.dot}></span> {pkg.status}
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
              <p className={style.infoValue} style={{ fontWeight: "600" }}>{pkg.durationInDays } Days</p>
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
                 {pkg.status}
              </p>
            </div>
            {/* <div className={style.gridItemFourth}>
              <label className={style.infoLabel}>Last Updated</label>
              <p className={style.infoValue}>
                {pkg.lastUpdated ? formatDate(pkg.lastUpdated) : "N/A"}
              </p>
            </div> */}
          </div>
        </section>

        {/* Card 2: Pricing */}
        <section className={style.detailsCard}>
          <h2 className={`${style.cardTitle} totalFont`}>Pricing</h2>
          <div className={style.pricingGrid}>
            {/* Base Price */}
            <div className={style.pricingBlock}>
              <label className={style.infoLabel}>Base Price</label>
              <div className={style.basePriceVal}>EGP {originalVal.toLocaleString()}</div>
              <span className={style.perText}>per {pkg.durationInDays || 30} days</span>
            </div>

            {/* Active Sale Badge */}
            <div className={style.pricingBlock} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              {pkg.isOnSale && (
                <>
                  <label className={style.infoLabel}>Active Sale</label>
                  <div className={style.saleTag}>
                    <i className="fa-solid fa-percent" style={{ fontSize: "10px", marginRight: "4px" }}></i>
                    {pkg.discountPercentage}% Off
                  </div>
                </>
              )}
            </div>

            {/* Discounted Price Details */}
            <div className={style.pricingBlockRight}>
              {pkg.isOnSale ? (
                <>
                  <div className={style.currentPriceVal}>EGP {currentVal.toLocaleString()}</div>
                  <div className={style.saleDates}>
                    {formatDate(pkg.saleStartDate)} — {formatDate(pkg.saleEndDate)}
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

        {/* Card 3: Included Services */}
        <section className={style.detailsCard}>
          <div className={style.cardHeaderRow}>
            <h2 className={`${style.cardTitle} totalFont`}>Included Services</h2>
            <span className={style.countBadge}>{servicesList.length} services</span>
          </div>
          <div className={style.servicesList}>
            {servicesList.map((service, index) => {
              const firstLetter = service.name ? service.name.charAt(0).toUpperCase() : "S";
              const isUnlimited = service.limitType === "Unlimited" || service.isUnlimited || !service.limitValue;
              
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
                        {service.limitValue?.toLocaleString() || service.limitValue} tokens
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
