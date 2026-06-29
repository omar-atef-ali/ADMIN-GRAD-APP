import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import style from "./ViewServices.module.css";
import api from "../../api";

export default function ViewServies() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback premium mock data matching the screenshot exactly


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
                <span className={style.benefitText}> {benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Card 3: Pricing Plans */}
        <section className={style.detailsCard}>
          <div className={style.cardHeaderRow}>
            <h2 className={`${style.cardTitle} totalFont`}>Pricing Plans</h2>
            <span className={style.countBadge}> plans</span>
          </div>
          <div className={style.plansList}>
            {service.pricingPlans?.map((plan) => (
              <div key={plan.id} className={style.planRow}>
                <div className={style.planLeft}>
                  <div className={style.planDurationBadge}>
                    {plan.id}
                  </div>
                  <div className={style.planMeta}>
                    <h4 className={style.planName}>{plan.durationInDays} Days</h4>
                  </div>
                </div>
                <div className={style.planRight}>
                  {plan.isOnSale && (
                    <span className={style.originalPrice}>EGP {plan.originalPrice}</span>
                  )}
                  <span className={style.planPrice}>EGP {plan.currentPrice}</span>
                  {plan.originalPrice && plan.isOnSale && (
                    <div className={style.discountWrapper}>
                      <span className={style.discountTag}>
                        {plan.discountPercentage}% Off - until {new Date(plan.saleEndDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
