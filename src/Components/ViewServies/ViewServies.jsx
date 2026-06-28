import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import style from "./ViewServies.module.css";
import api from "../../api";

export default function ViewServies() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback premium mock data matching the screenshot exactly
  const mockService = {
    id: id || "1",
    name: "AI Recommendation",
    subtitle: "Personalized AI-driven recommendations",
    description: "Advanced ML models analyze user behavior to deliver highly personalized product and content recommendations at scale.",
    priority: 1,
    status: "Active",
    lastUpdated: "20 Jan 2025",
    benefits: [
      "Increase conversion rate by up to 25%",
      "Real-time personalization engine",
      "Seamless API integration",
      "Advanced analytics dashboard",
      "Multi-language support"
    ],
    pricingPlans: [
      {
        id: "p1",
        duration: "30D",
        name: "30 Days",
        subtitle: "Monthly",
        price: "EGP 5,000"
      },
      {
        id: "p2",
        duration: "90D",
        name: "90 Days",
        subtitle: "Quarterly",
        price: "EGP 12,150",
        originalPrice: "EGP 13,500",
        discountTag: "10% off until 31 Mar 2026"
      },
      {
        id: "p3",
        duration: "365D",
        name: "365 Days",
        subtitle: "Annual",
        price: "EGP 48,000"
      }
    ]
  };

  useEffect(() => {
    async function fetchService() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await api.get(`/Services/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Map backend response fields to component state
        if (response.data) {
          const data = response.data;
          setService({
            id: data.id || id,
            name: data.name || data.serviceName || mockService.name,
            subtitle: data.subtitle || mockService.subtitle,
            description: data.description || mockService.description,
            priority: data.priority !== undefined ? data.priority : mockService.priority,
            status: data.status || (data.isActive ? "Active" : "Inactive") || mockService.status,
            lastUpdated: data.lastUpdated || (data.updatedOn ? new Date(data.updatedOn).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : mockService.lastUpdated),
            benefits: data.benefits || mockService.benefits,
            pricingPlans: data.pricingPlans || mockService.pricingPlans
          });
        } else {
          setService(mockService);
        }
      } catch (error) {
        console.warn("Backend API not resolved or failed. Using premium mock fallback.", error);
        setService(mockService);
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
        <button className={style.editBtn}>
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
              <p className={style.infoValue} style={{"fontWeight":"600"}}>{service.name}</p>
            </div>
            <div className={style.gridItemHalf}>
              <label className={style.infoLabel}>Subtitle</label>
              <p className={style.infoValueDescription}>{service.subtitle}</p>
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
              <p className={style.infoValue}>{service.lastUpdated}</p>
            </div>
          </div>
        </section>

        {/* Card 2: Key Benefits */}
        <section className={style.detailsCard}>
          <div className={style.cardHeaderRow}>
            <h2 className={`${style.cardTitle} totalFont`}>Key Benefits</h2>
            <span className={style.countBadge}>{service.benefits.length} benefits</span>
          </div>
          <div className={style.benefitsList}>
            {service.benefits.map((benefit, index) => (
              <div key={index} className={style.benefitRow}>
                <span className={style.checkIcon}>✓</span>
                <span className={style.benefitText}>#{index + 1} {benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Card 3: Pricing Plans */}
        <section className={style.detailsCard}>
          <div className={style.cardHeaderRow}>
            <h2 className={`${style.cardTitle} totalFont`}>Pricing Plans</h2>
            <span className={style.countBadge}>{service.pricingPlans.length} plans</span>
          </div>
          <div className={style.plansList}>
            {service.pricingPlans.map((plan, index) => (
              <div key={plan.id || index} className={style.planRow}>
                <div className={style.planLeft}>
                  <div className={style.planDurationBadge}>
                    {plan.duration}
                  </div>
                  <div className={style.planMeta}>
                    <h4 className={style.planName}>{plan.name}</h4>
                    <p className={style.planSubtitle}>{plan.subtitle}</p>
                  </div>
                </div>
                <div className={style.planRight}>
                  <span className={style.planPrice}>{plan.price}</span>
                  {plan.originalPrice && (
                    <div className={style.discountWrapper}>
                      <span className={style.originalPrice}>{plan.originalPrice}</span>
                      <span className={style.discountTag}>
                        → {plan.discountTag}
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
