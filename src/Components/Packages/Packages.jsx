import React, { useContext, useEffect, useState } from "react";
import styles from "./Packages.module.css";
import { FaPlus, FaSearch, FaChevronDown, FaPencilAlt } from "react-icons/fa";
import api from "../../api";
import { userContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
export default function Packages() {
    const { userToken } = useContext(userContext)
    const navigate=useNavigate()

    const [packages, setPackages] = useState([])

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("");

    // Toggle status (Active / Inactive)
    const handleStatusToggle = (id) => {
        setPackages(prev =>
            prev.map(pkg => {
                if (pkg.id === id) {
                    const newStatus = pkg.status === "Active" ? "Inactive" : "Active";
                    return { ...pkg, status: newStatus };
                }
                return pkg;
            })
        );
    };

    

    // get All packages
    async function getAllPackages() {
        try {
            const { data } = await api.get('admin/packages', {
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                params: {
                    search: searchQuery,
                    status:statusFilter,
                    prioritySort:sortBy
                }



            });
            console.log(data)
            setPackages(data)


        }
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getAllPackages()
    }, [searchQuery,statusFilter,sortBy])

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.headerText}>
                    <h2 className={styles.title}>Packages</h2>
                    <p className={styles.subtitle}>
                        Create and manage service bundles, pricing, token allocations, and package discounts.
                    </p>
                </div>
                <button className={styles.addButton} onClick={() => navigate("/dashboard/packages/add")} type="button">
                    <FaPlus size={12} /> Add Package
                </button>
            </div>

            {/* Filter and Sort Controls */}
            <div className={styles.filterBar}>
                <div className={styles.filtersLeft}>
                    {/* Search input */}
                    <div className={styles.searchWrapper}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search packages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className={styles.selectWrapper}>
                        <select
                            className={styles.selectElement}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">Status: All</option>
                            <option value="Active">Status: Active</option>
                            <option value="Inactive">Status: Inactive</option>
                        </select>
                        <FaChevronDown className={styles.selectChevron} />
                    </div>

                    {/* Sort dropdown */}
                    <div className={styles.selectWrapper}>
                        <select
                            className={styles.selectElement}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="" >Sort: Priority</option>
                            <option value="Ascending">Ascending</option>
                            <option value="Descending">Descending</option>
                        </select>
                        <FaChevronDown className={styles.selectChevron} />
                    </div>
                </div>

                {/* Packages Count */}
                <div className={styles.packagesCount}>
                    {packages.length} Packages
                </div>
            </div>

            {/* Packages Table Card */}
            <div className={styles.tableCard}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th} style={{ width: "25%" }}>Package</th>
                                <th className={styles.th} style={{ width: "22%" }}>Included Services</th>
                                <th className={styles.th} style={{ width: "12%" }}>Duration</th>
                                <th className={styles.th} style={{ width: "12%" }}>Price</th>
                                <th className={styles.th} style={{ width: "12%" }}>Discount</th>
                                <th className={styles.th} style={{ width: "8%" }}>Status</th>
                                <th className={styles.th} style={{ width: "8%" }}>Priority</th>
                                <th className={styles.th} style={{ width: "8%" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.length > 0 ? (
                                packages.map((pkg) => (
                                    <tr key={pkg.id} className={styles.row}>
                                        {/* Package cell with avatar and description */}
                                        <td className={styles.td}>
                                            <div className={styles.packageCell}>
                                                <div className={styles.avatar}>
                                                    {pkg.avatarLetter}
                                                </div>
                                                <div className={styles.packageInfo}>
                                                    <h4 className={styles.packageName}>{pkg.name}</h4>
                                                    <p className={styles.packageDesc} title={pkg.desc}>
                                                        {pkg.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Included Services Badge list */}
                                        <td className={styles.td}>
                                            <div className={styles.servicesCell}>
                                                {pkg.services.map((service, index) => {
                                                    const isMore = service.startsWith("+");
                                                    return (
                                                        <span
                                                            key={index}
                                                            className={isMore ? styles.moreServicesBadge : styles.serviceBadge}
                                                        >
                                                            {service}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>

                                        {/* Duration */}
                                        <td className={styles.td}>
                                            <span className={styles.durationText}>{pkg.durationInDays} Days</span>
                                        </td>

                                        {/* Price / Strikethrough */}
                                        <td className={styles.td}>
                                            <div className={styles.priceCell}>
                                                <span className={styles.priceText}>EGP {pkg.price}</span>
                                                {pkg.discountPercentage !== 0 ?
                                                    <span className={styles.originalPrice}>
                                                        EGP {pkg.price - (pkg.price * pkg.discountPercentage) / 100}
                                                    </span> : ""}

                                            </div>
                                        </td>

                                        {/* Discount with orange star sparkles */}
                                        <td className={styles.td}>
                                            {pkg.discountPercentage !== 0 ? (
                                                <span className={styles.discountBadge}>
                                                    <span className={styles.sparkleGroup}>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                            {/* Larger star */}
                                                            <path d="M10 2L12.2 9.8L20 12L12.2 14.2L10 22L7.8 14.2L0 12L7.8 9.8L10 2Z" />
                                                            {/* Smaller star */}
                                                            <path d="M19 13L20.2 17.2L24 18L20.2 18.8L19 23L17.8 18.8L14 18L17.8 17.2L19 13Z" opacity="0.8" />
                                                        </svg>
                                                    </span>
                                                    {pkg.discountPercentage} %off
                                                </span>
                                            ) : (
                                                <span className={styles.noDiscountText}>No Discount</span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className={styles.td}>
                                            <span className={`${styles.statusBadge} ${pkg.status === "Active" ? styles.active : styles.inactive}`}>
                                                <span className={`${styles.statusDot} ${pkg.status === "Active" ? styles.active : styles.inactive}`} />
                                                {pkg.status}
                                            </span>
                                        </td>

                                        {/* Priority */}
                                        <td className={styles.td}>
                                            <span className={styles.priorityBadge}>
                                                {pkg.priority}
                                            </span>
                                        </td>

                                        {/* Actions: Edit + Toggle */}
                                        <td className={styles.td}>
                                            <div className={styles.actionsWrapper}>
                                                <button
                                                    className={styles.editButton}
                                                    title="Edit Package"
                                                    type="button"
                                                >
                                                    <FaPencilAlt size={13} />
                                                </button>

                                                <label className={styles.switch}>
                                                    <input
                                                        type="checkbox"
                                                        checked={pkg.status === "Active"}
                                                        onChange={() => handleStatusToggle(pkg.id)}
                                                    />
                                                    <span className={styles.slider}></span>
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className={styles.td} style={{ textAlign: "center", color: "#6b7280", padding: "32px" }}>
                                        No packages found matching the criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}