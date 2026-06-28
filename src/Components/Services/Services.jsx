import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Services.module.css";
import { FaPlus, FaSearch, FaChevronDown, FaPencilAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import api from '../../api'
import { userContext } from "../../context/userContext";
export default function Services() {
    const {userToken}=useContext(userContext)
    const navigate = useNavigate();
    const [services, setServices]=useState([])

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Priority");

    // Toggle service status (Active / Inactive)
    const handleStatusToggle = (id) => {
        setServices(prev =>
            prev.map(service => {
                if (service.id === id) {
                    const newStatus = service.status === "Active" ? "Inactive" : "Active";
                    return { ...service, status: newStatus };
                }
                return service;
            })
        );
    };


    // Filter and sort the services list
    const filteredServices = services
        .filter(service => {
            const matchesSearch =
                service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.subTitle.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus =
                statusFilter === "All" ||
                service.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === "Priority") {
                return a.priority - b.priority;
            } else if (sortBy === "Alphabetical") {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });

    // get All Services
    async function getAllServices() {
        try{
            const {data}=await api.get('/admin/services',{
                headers:{
                    Authorization:`Bearer ${userToken}`
                }
            })
            console.log(data)
            setServices(data)

        }
        catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        getAllServices()
    },[])

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.headerText}>
                    <h2 className={styles.title}>Services</h2>
                    <p className={styles.subtitle}>
                        Manage customer-facing AI services and their pricing configurations.
                    </p>
                </div>
                <button className={styles.addButton} onClick={() => navigate("/dashboard/services/add")}>
                    <FaPlus size={12} /> Add Service
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
                        placeholder="Search services..."
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
                        <option value="Priority">Sort: Priority</option>
                        <option value="Alphabetical">Sort: Alphabetical</option>
                    </select>
                    <FaChevronDown className={styles.selectChevron} />
                </div>
            </div>

            {/* Services Table Card */}
            <div className={styles.tableCard}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th} style={{ width: "30%" }}>Service</th>
                                <th className={styles.th} style={{ width: "15%" }}>Pricing Plans</th>
                                <th className={styles.th} style={{ width: "15%" }}>Key Benefits</th>
                                <th className={styles.th} style={{ width: "10%" }}>Priority</th>
                                <th className={styles.th} style={{ width: "10%" }}>Status</th>
                                <th className={styles.th} style={{ width: "12%" }}>Last Updated</th>
                                <th className={styles.th} style={{ width: "8%" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.length > 0 ? (
                                filteredServices.map((service) => {
                                    // Get first letter of service name for Avatar
                                    const firstLetter = service.name ? service.name.charAt(0).toUpperCase() : "";
                                    
                                    return (
                                        <tr key={service.id} className={styles.row}>
                                            {/* Service details column */}
                                            <td className={styles.td}>
                                                <div className={styles.serviceCell}>
                                                    <div className={styles.avatar}>
                                                        {/* {firstLetter} */}
                                                        <img src={`https://deebai.runasp.net/${service.iconURL}`} alt="" />
                                                    </div>
                                                    <div className={styles.serviceInfo}>
                                                        <h4 className={styles.serviceName}>{service.name}</h4>
                                                        <p className={styles.serviceDesc}>{service.subTitle}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Pricing Plans Column */}
                                            <td className={styles.td}>
                                                <div className={styles.plansCount}>{service.pricingPlanCount} Plans</div>
                                                {/* <div className={styles.plansPrice}>from {service.minPrice}</div> */}
                                            </td>

                                            {/* Key Benefits Column */}
                                            <td className={styles.td}>
                                                <span className={styles.benefitsText}>{service.keyBenefitCount} Benefits</span>
                                            </td>

                                            {/* Priority Column */}
                                            <td className={styles.td}>
                                                <span className={styles.priorityBadge}>
                                                    {service.priority}
                                                </span>
                                            </td>

                                            {/* Status Badge Column */}
                                            <td className={styles.td}>
                                                <span className={`${styles.statusBadge} ${service.status === "Active" ? styles.active : styles.inactive}`}>
                                                    <span className={`${styles.statusDot} ${service.status === "Active" ? styles.active : styles.inactive}`} />
                                                    {service.status}
                                                </span>
                                            </td>

                                            {/* Last Updated Column */}
                                            <td className={styles.td}>
                                                <span className={styles.dateText}>{new Date(service.lastUpdated).toLocaleDateString("en-GB",{
                                                    day:'2-digit',
                                                    month:'short',
                                                    year:"numeric"
                                                })}</span>
                                            </td>

                                            {/* Actions Column */}
                                            <td className={styles.td}>
                                                <div className={styles.actionsWrapper}>
                                                    {/* Edit button */}
                                                    <button 
                                                        className={styles.editButton} 
                                                        title="Edit Service"
                                                        
                                                    >
                                                        <FaPencilAlt size={13} />
                                                    </button>

                                                    {/* Status Toggle Switch */}
                                                    <label className={styles.switch}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={service.status === "Active"}
                                                            onChange={() => handleStatusToggle(service.id)}
                                                        />
                                                        <span className={styles.slider}></span>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className={styles.td} style={{ textAlign: "center", color: "#6b7280", padding: "32px" }}>
                                        No services found matching the criteria.
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