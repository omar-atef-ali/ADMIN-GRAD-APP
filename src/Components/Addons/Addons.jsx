import React, { useContext, useEffect, useState } from "react";
import styles from "./Addons.module.css";
import { FaPlus, FaSearch, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { userContext } from "../../context/userContext";
import api from "../../api";

export default function Addons() {
  const { userToken } = useContext(userContext);
  const [addons, setAddons] = useState([]);
  const [services, setServices] = useState([]);

  // Modal Visibility States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);

  // Form Field States
  const [title, setTitle] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [price, setPrice] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [durationDays, setDurationDays] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceFilter, setSelectedServiceFilter] = useState("All");

  // Fetch Addon Offers
  async function getAddons(search = searchQuery, srvId = selectedServiceFilter) {
    try {
      if (isFirstLoad) {
        setPageLoading(true);
      }
      const params = {};
      if (search.trim()) {
        params.search = search.trim();
      }
      if (srvId && srvId !== "All") {
        params.serviceId = srvId;
      }

      const { data } = await api.get('/admin/add-on-offers', {
        params,
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      setAddons(data || []);
    } catch (error) {
      console.log(error)
      toast.error(
        error?.response?.data?.errors?.[1] || "Failed to load Customers.",
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
      setPageLoading(false);
      setIsFirstLoad(false);
    }
  }

  // Fetch Services for dropdowns
  async function getServices() {
    try {
      const { data } = await api.get('/admin/services', {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      setServices(data || []);
    } catch (error) {
      console.error(error);
    }
  }


  async function newAddons() {
    try {
      setLoading(true);
      const payload = {
        title,
        price: parseFloat(price),
        serviceId: serviceId,
        tokenAmount: (tokenAmount && parseInt(tokenAmount) !== 0) ? parseInt(tokenAmount) : null,
        durationDays: (durationDays && parseInt(durationDays) !== 0) ? parseInt(durationDays) : null,
      };

      await api.post("/admin/add-on-offers", payload, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });

      toast.success("New addon created successfully");
      setShowAddModal(false);
      getAddons();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || error?.response?.detail || "Failed to create addon.",
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
      setLoading(false);
    }
  }

  async function handleCreateOffer(e) {
    e.preventDefault();
    if (!title || !serviceId || !price) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (tokenAmount && parseInt(tokenAmount) < 0) {
      toast.error("Tokens must be greater than or equal to zero.");
      return;
    }
    if (durationDays && parseInt(durationDays) < 0) {
      toast.error("Duration must be greater than or equal to zero.");
      
      return;
    }
    const tokens = tokenAmount ? parseInt(tokenAmount) : 0;
    const duration = durationDays ? parseInt(durationDays) : 0;
    if (tokens <= 0 && duration <= 0) {
      toast.error("You must put a value for tokens, duration, or both.",
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

      return;
    }
    await newAddons();
  }

  async function handleSaveChanges(e) {
    e.preventDefault();
    if (!title || !serviceId || !price) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (tokenAmount && parseInt(tokenAmount) < 0) {
      toast.error("Tokens must be greater than or equal to zero",
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
      return;
    }
    if (durationDays && parseInt(durationDays) < 0) {
      toast.error("Duration must be greater than or equal to zero.");
      return;
    }
    const tokens = tokenAmount ? parseInt(tokenAmount) : 0;
    const duration = durationDays ? parseInt(durationDays) : 0;
    if (tokens <= 0 && duration <= 0) {
      toast.error("An add-on offer must grant tokens, duration, or both",
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
      return;
    }
    try {
      setLoading(true);
      const payload = {
        title,
        price: parseFloat(price),
        serviceId: serviceId,
        tokenAmount: (tokenAmount && parseInt(tokenAmount) !== 0) ? parseInt(tokenAmount) : null,
        durationDays: (durationDays && parseInt(durationDays) !== 0) ? parseInt(durationDays) : null,
      };

      await api.put(`/admin/add-on-offers/${selectedAddon.id}`, payload, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });

      toast.success("Add-on offer updated successfully!");
      setShowEditModal(false);
      getAddons();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || error?.detail || "Failed to update addon.",
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
      setLoading(false);
    }
  }

  async function handleDelete(id, name) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete this offer: "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#FAF8F6",
      color: "#1C1814",
      confirmButtonColor: "#D93025",
      cancelButtonColor: "#8C8581",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/admin/add-on-offers/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      toast.success("Offer deleted successfully!");
      getAddons();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || error?.response?.data?.errors?.[1] || "Failed to delete addon.",
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
    }
  }

  useEffect(() => {
    if (userToken) {
      getServices();
    }
  }, [userToken]);

  useEffect(() => {
    if (userToken) {
      getAddons(searchQuery, selectedServiceFilter);
    }
  }, [searchQuery, selectedServiceFilter, userToken]);

  // Open Add Modal
  const openAddModal = () => {
    setTitle("");
    setServiceId("");
    setPrice("");
    setTokenAmount("");
    setDurationDays("");
    setShowAddModal(true);
  };

  // Open Edit Modal
  const openEditModal = (addon) => {
    setSelectedAddon(addon);
    setTitle(addon.title || "");
    setServiceId(addon.serviceId || "");
    setPrice(addon.price || "");
    setTokenAmount(addon.tokenAmount || "");
    setDurationDays(addon.durationDays || "");
    setShowEditModal(true);
  };







  return (
    <>
      {pageLoading && (
        <div className={styles.overlay}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Add-on Offers</h2>
          <p className={styles.subtitle}>
            Manage purchasable add-ons clients can use to top up their existing subscriptions.
          </p>
        </div>
        <button className={styles.addButton} onClick={openAddModal}>
          <FaPlus size={12} /> New Offer
        </button>
      </div>

      {/* Filter and Sort Controls */}
      <div className={styles.filterBar}>
        {/* Search input */}
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Service Filter */}
        <div className={styles.selectWrapper}>
          <select
            className={styles.selectElement}
            value={selectedServiceFilter}
            onChange={(e) => setSelectedServiceFilter(e.target.value)}
          >
            <option value="All">All Services</option>
            {services.map((srv) => (
              <option key={srv.id} value={srv.id}>
                {srv.name}
              </option>
            ))}
          </select>
        </div>

        {/* Count display on the right */}
        <div className={styles.countText}>{addons.length} {addons.length === 1 ? 'offer' : 'offers'}</div>
      </div>

      {/* Offers Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Title</th>
                <th className={styles.th}>Service</th>
                <th className={styles.th}>Price</th>
                <th className={styles.th}>Tokens</th>
                <th className={styles.th}>Duration</th>
                <th className={styles.th}>Updated on</th>
                <th className={styles.th}>Purchases</th>
                <th className={styles.th}>Created</th>
                <th className={styles.th} style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addons.length > 0 ? (
                addons.map((item) => (
                  <tr className={styles.row} key={item.id}>
                    <td className={styles.td}>
                      <span className={styles.offerTitle}>{item.title}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.serviceText}>{item.serviceName}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.priceText}>EGP {item.price}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.tokensValue}>{item.tokenAmount ? item.tokenAmount : '—'}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.dashText}>{item.durationDays ? item.durationDays + ' days' : '—'}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.dateText}>
                        {item.updatedOn ? new Date(item.updatedOn).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }) : '—'}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.purchasesText} ${styles.purchasesActive}`}>{item.purchaseCount}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.dateText}>
                        {item.createdOn ? new Date(item.createdOn).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }) : (item.created ? new Date(item.created).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }) : '—')}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actionsWrapper}>
                        <button
                          className={styles.actionBtn}
                          title="Edit Offer"
                          onClick={() => openEditModal(item)}
                        >
                          <FaPencilAlt />
                        </button>
                        {item.purchaseCount === 0 || !item.purchaseCount ? (
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            title="Delete Offer"
                            onClick={() => handleDelete(item.id, item.title)}
                          >
                            <FaTrashAlt />
                          </button>
                        ) : (
                          <button
                            disabled
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            style={{ opacity: 0.4, cursor: "default" }}
                            title="You can't delete this offer because it has purchases"
                          >
                            <FaTrashAlt />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className={styles.td} style={{ textAlign: "center", color: "#9C9A97", padding: "24px" }}>
                    No add-on offers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW OFFER MODAL */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setShowAddModal(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3 className={styles.modalTitle}>New Add-on Offer</h3>
            <p className={styles.modalSubtitle}>Create a purchasable add-on for client subscriptions.</p>

            <form onSubmit={handleCreateOffer}>
              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.modalLabel}>Title <span className={styles.required}>*</span></label>
                  <span className={styles.charCount}>{title.length}/200</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Extra AI Tokens Pack"
                  className={styles.modalInput}
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.modalLabel}>Service <span className={styles.required}>*</span></label>
                  <select
                    className={styles.modalSelect}
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Service</option>
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.modalLabel}>Price (EGP) <span className={styles.required}>*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="EGP 350.00"
                    className={styles.modalInput}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.grantSection}>
                <h4 className={styles.grantTitle}>Grant <span className={styles.grantSubtitle}>(at least one required)</span></h4>
                <p className={styles.grantDesc}>
                  Tokens, extra duration, or both. The combination determines which plan types this offer is available for.
                </p>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.modalLabel}>Tokens</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 500"
                      className={styles.modalInput}
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.modalLabel}>Duration (days)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 30"
                      className={styles.modalInput}
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                      
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? "Creating..." : "Create Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT OFFER MODAL */}
      {showEditModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setShowEditModal(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3 className={styles.modalTitle}>Edit Add-on Offer</h3>
            <p className={styles.modalSubtitle}>Editing: {selectedAddon?.title}</p>

            <form onSubmit={handleSaveChanges}>
              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.modalLabel}>Title <span className={styles.required}>*</span></label>
                  <span className={styles.charCount}>{title.length}/200</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Extra AI Tokens Pack"
                  className={styles.modalInput}
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.modalLabel}>Service <span className={styles.required}>*</span></label>
                  <select
                    className={styles.modalSelect}
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Service</option>
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.modalLabel}>Price (EGP) <span className={styles.required}>*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="EGP 350.00"
                    className={styles.modalInput}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.grantSection}>
                <h4 className={styles.grantTitle}>Grant <span className={styles.grantSubtitle}>(at least one required)</span></h4>
                <p className={styles.grantDesc}>
                  Tokens, extra duration, or both. Add-ons can only be purchased against Customized Plans.
                </p>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.modalLabel}>Tokens</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 500"
                      className={styles.modalInput}
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.modalLabel}>Duration (days)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 30"
                      className={styles.modalInput}
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
