import React, { useContext, useEffect, useState } from "react";
import style from "./users.module.css";
import api from "../../api";
import { userContext } from "../../context/userContext";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useFormik } from "formik";

export default function Users() {
    const { userToken } = useContext(userContext);
    const [allusers, setallusers] = useState([])
    const [allRoles, setAllRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchtext, setsearchtext] = useState('')
    const [Propertiesvalue, setPropertiesvalue] = useState([])
    const [sortColumn, setSortColumn] = useState("");
    const [sortDirection, setSortDirection] = useState("ASC");

    const handleSort = (column, direction) => {
        setSortColumn(column);
        setSortDirection(direction);
        getAllUsers(1, column, direction); // جلب الصفحة الأولى مع الـ sorting
    };
    async function getAllUsers(page = currentPage, column = sortColumn, direction = sortDirection) {
        try {
            let searchParams = [];
            const trimmedSearch = searchtext.trim();
            const nameParts = trimmedSearch.split(" ");

            // تجهيز search params
            if (trimmedSearch) {
                if (nameParts.length >= 2) {
                    const firstName = nameParts[0].toLowerCase();
                    const lastName = nameParts.slice(1).join(" ").toLowerCase();
                    if (Propertiesvalue.includes("firstName")) searchParams.push({ property: "FirstName", value: firstName });
                    if (Propertiesvalue.includes("lastName")) searchParams.push({ property: "LastName", value: lastName });
                } else {
                    if (Propertiesvalue.includes("firstName")) searchParams.push({ property: "FirstName", value: nameParts[0].toLowerCase() });
                    if (Propertiesvalue.includes("lastName")) searchParams.push({ property: "LastName", value: nameParts[0].toLowerCase() });
                }

                if (Propertiesvalue.includes("email")) searchParams.push({ property: "Email", value: trimmedSearch.toLowerCase() });
            }

            // إنشاء query string للـ API
            let queryString = searchParams
                .map(p => `SearchProperties=${p.property}&SearchValue=${encodeURIComponent(p.value)}`)
                .join("&");

            if (queryString) queryString += "&";
            if (column && column !== "name") queryString += `SortColumn=${column}&SortDirection=${direction}`;

            // جلب البيانات من الـ API
            const response = await api.get(`/users?pageNumber=${page}&${queryString}`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });

            let filteredUsers = response.data.items;

            // فرز الاسم الكامل في الـ frontend لو المطلوب sort على الاسم
            if (column === "name") {
                filteredUsers.sort((a, b) => {
                    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                    return direction === "ASC" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
                });
            }

            setallusers(filteredUsers);
            setTotalPages(response.data.totalPages);

        } catch (error) {
            console.log(error);
        }
    }

    const handleSelect = (items) => {
        setPropertiesvalue((prev) => {
            let newValues = [...prev];
            items.forEach((item) => {
                if (newValues.includes(item)) {
                    newValues = newValues.filter((i) => i !== item);
                } else {
                    newValues.push(item);
                }
            });
            return newValues;
        });
    };



    async function search(e) {
        e.preventDefault();
        setCurrentPage(1);
        await getAllUsers(1);
    }

    async function getAllRoles(page = currentPage) {
        try {
            const { data } = await api.get(`/Roles?pageNumber=${page}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            console.log(data);
            setAllRoles(data.items);
            // setTotalPages(data.totalPages);
        } catch (error) {
            console.log(error);
        }
    }
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;

        setCurrentPage(page);
        getAllUsers(page);
    };
    async function handleToggleUser(user) {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to ${user.isDisapled ? "Unlock" : "Lock"} this user: ${user.email}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, confirm",
            cancelButtonText: "Cancel",
            background: "#1f1f1f",
            color: "#fff",
            confirmButtonColor: "rgb(10, 104, 159)",
            cancelButtonColor: "#646262ff",
            customClass: {
                popup: "custom-popup",
            }

        });

        if (!result.isConfirmed) {
            toast("Operation cancelled — No changes were made", {

                background: "#1f1f1f",
                color: "#fff",
            });
            return;
        }

        try {
            await api.put(
                `/users/${user.id}/toggle-status`,
                {},
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            setallusers(prev =>
                prev.map(u =>
                    u.id === user.id ? { ...u, isDisabled: !u.isDisabled } : u
                )
            );

            toast.success(
                `${user.email} is now ${!user.isDisabled ? "Locked" : "Unlocked"}`
            );

        } catch (err) {
            console.log(err);
            toast.error("Error updating user status");
        }
    }
    useEffect(() => {
        if (userToken) {
            getAllUsers()
            getAllRoles()
        }
    }, [userToken])
    useEffect(() => {
        if (searchtext.trim() === "" && userToken) {
            setPropertiesvalue([]);
            getAllUsers(1);
        }
    }, [searchtext, userToken]);

    let [loading, setLoading] = useState(false);
    async function submit(values) {
        console.log(values)
        try {
            setLoading(true);
            const response = await api.post("/users", values, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            console.log("Success:", response.data);
            toast.success(
                "user add successfuly"
            )
            getAllUsers()
        } catch (error) {
            console.log("Error:", error);
            toast.error(
                error.response?.data?.errors[1] ||
                "Something went wrong while registration.",
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

    let validationLogin = yup.object({
        firstName: yup.string().min(3, "first name must be at least 3 characters long").max(100, "first name must be at maximum 100 characters long"),
        lastName: yup.string().min(3, "last name must be at least 3 characters long").max(100, "last name must be at maximum 100 characters long"),
        email: yup.string()
            .email("Please enter a valid email address")
            .max(256, "email must be at maximum 256 characters long"),
        role: yup.string().min(3, "first name must be at least 3 characters long").max(100, "first name must be at maximum 100 characters long"),
    });

    let formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            role: "",
        },
        validationSchema: validationLogin,
        onSubmit: submit,
    });
    async function EditSubmit(values) {
        try {
            setLoading(true);

            const response = await api.put(`/users/${selectedUser.id}`, values, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            toast.success("User updated successfully");

            // تحديث البيانات محلياً
            setallusers(prev =>
                prev.map(u => u.id === selectedUser.id ? { ...u, ...values } : u)
            );

            setShowModal2(false);

        } catch (error) {
            console.log("Error:", error);
            toast.error("Failed to update user");
        } finally {
            setLoading(false);
        }
    }


    let formik2 = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            role: "",
        },
        validationSchema: validationLogin,
        onSubmit: EditSubmit,
    });


    return (
        <>
            <div className={` container-fluid ${style.rolesPage}`}>
                <div className=" d-flex justify-content-between">
                    <h2 className={`${style.rolesH} totalFont`}>Users</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className={`${style.RoleButton} totalFont  col-6 col-md-4 col-lg-2`}
                    >
                        <i className="fa-solid fa-circle-plus"></i> Add User
                    </button>
                </div>

                <div className={`${style.rolesTable}`}>
                    <div className={`${style.innerTable}`}>
                        <div className={`${style.searchContainer} `}>
                            <form className="d-flex">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder=" Search Users..."
                                    aria-label="Search"
                                    onChange={(e) => setsearchtext(e.target.value)}
                                    value={searchtext}
                                />
                                <button
                                    onClick={search}
                                    className={`${style.UserButton} totalFont  col-3 col-md-2 col-lg-1`}

                                >
                                    Search
                                </button>
                            </form>
                        </div>

                        <div className={`${style.tableWrapper}`}>
                            <table className={`${style.realTable}  table-bordered  `}>
                                <thead>
                                    <tr>
                                        <th className="totalFont " style={{ width: "13%" }}>



                                            <div className={style.sortingContainer}>
                                                Name
                                                <input
                                                    type="checkbox"
                                                    className={`${style.checkboxx}`}
                                                    style={{ marginLeft: "6px" }}
                                                    checked={Propertiesvalue.includes("firstName") && Propertiesvalue.includes("lastName")}
                                                    onChange={() => {
                                                        if (Propertiesvalue.includes("firstName") && Propertiesvalue.includes("lastName")) {
                                                            setPropertiesvalue(prev => prev.filter(i => i !== "firstName" && i !== "lastName"));
                                                        } else {
                                                            setPropertiesvalue(prev => [...prev, "firstName", "lastName"]);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    className={`${style.sortBtn} btn p-0 m-0 border-0 `}
                                                    onClick={() => handleSort("name", "ASC")}
                                                >
                                                    ▲
                                                </button>
                                                <button
                                                    className={`${style.sortBtn} btn p-0 m-0 border-0 `}
                                                    onClick={() => handleSort("name", "DESC")}
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                        </th>
                                        <th className="totalFont" style={{ width: "13%" }}>
                                            <div className={style.sortingContainer}>
                                                Email
                                                <input
                                                    type="checkbox"
                                                    className={`${style.checkboxx}`}
                                                    style={{ marginLeft: "6px" }}
                                                    checked={Propertiesvalue.includes("email")}
                                                    onChange={() => handleSelect(["email"])}
                                                />

                                                <button
                                                    className={`${style.sortBtn} btn p-0 m-0 border-0 `}
                                                    onClick={() => handleSort("email", "ASC")}
                                                >
                                                    ▲
                                                </button>
                                                <button
                                                    className={`${style.sortBtn} btn p-0 m-0 border-0 `}
                                                    onClick={() => handleSort("email", "DESC")}
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                        </th>
                                        <th className="totalFont" style={{ width: "13%" }}>
                                            Role
                                        </th>
                                        <th className="totalFont" style={{ width: "13%" }}>
                                            Created On
                                        </th>
                                        <th className="totalFont" style={{ width: "13%" }}>
                                            Edit
                                        </th>
                                        <th className="totalFont" style={{ width: "13%" }}>
                                            Status
                                        </th>
                                        <th className="totalFont" style={{ width: "13%" }}>
                                            Is Disapled
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allusers.map((user) => (
                                        <tr key={user.id}>
                                            <td data-label="Name">{`${user.firstName} ${user.lastName}`}</td>
                                            <td data-label="Email">{user.email}</td>
                                            <td data-label="Role">{user.role}</td>
                                            <td data-label="Created On">{user.createdOn}</td>
                                             <td>
                                            <button className={`${style.editebtn}`}
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    formik2.setValues({
                                                        firstName: user.firstName,
                                                        lastName: user.lastName,
                                                        email: user.email,

                                                        role: typeof user.role === "string" ? user.role : user.role?.name || ""
                                                    });
                                                    setShowModal2(true);
                                                }}

                                            ><i class="fa-regular fa-pen-to-square"></i>edit
                                            </button>
                                        </td>
                                            <td>
                                                <button
                                                    disabled={user.isLocked === false}   // Active → disabled
                                                    onClick={async () => {
                                                        try {
                                                            const result = await Swal.fire({
                                                                title: 'Change Status?',
                                                                text: `Do you want to change status for ${user.email}?`,
                                                                icon: 'question',
                                                                showCancelButton: true,
                                                                confirmButtonText: 'Yes, change',
                                                                cancelButtonText: 'Cancel',
                                                                background: "#1f1f1f",
                                                                color: "#fff",
                                                                confirmButtonColor: "rgb(10, 104, 159)",
                                                                cancelButtonColor: "#646262ff",
                                                            });

                                                            if (!result.isConfirmed) {
                                                                toast("Operation cancelled — No changes were made");
                                                                return;
                                                            }

                                                            await api.put(
                                                                `/users/${user.id}/unlock`,
                                                                {},
                                                                { headers: { Authorization: `Bearer ${userToken}` } }
                                                            );

                                                            setallusers((prev) =>
                                                                prev.map((u) =>
                                                                    u.id === user.id ? { ...u, isLocked: !u.isLocked } : u
                                                                )
                                                            );

                                                            toast.success(
                                                                `${user.email} is now ${user.isLocked ? "Active" : "Inactive"}`
                                                            );

                                                        } catch (err) {
                                                            console.log("Status error:", err);
                                                            toast.error("Error updating user status");
                                                        }
                                                    }}
                                                    className={`${user.isLocked ? style.inactivebtn : style.activebtn} totalFont`}
                                                >
                                                    {user.isLocked ? "Inactive" : "Active"}
                                                </button>
                                            </td>

                                            <td>
                                                <button
                                                    onClick={() => handleToggleUser(user)}
                                                    className={`${user.isDisabled ? style.lockIcon : style.openlockIcon} totalFont`}
                                                >
                                                    {user.isDisabled ? (
                                                        <i className="fa-solid fa-lock"></i>
                                                    ) : (
                                                        <i className="fa-solid fa-lock-open"></i>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>

                        </table>
                    </div>
                </div>

                {/* ///////////////////////////////////////////// */}

                <nav
                    className={style.paginationContainer}
                    aria-label="Page navigation"
                >
                    <ul className={style.paginationList}>
                        <li className={style.pageItem}>
                            <button
                                className={style.pageLink}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                «
                            </button>
                        </li>


                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            return (
                                <li key={page} className={style.pageItem}>
                                    <button
                                        className={`${style.pageLink} ${currentPage === page ? style.activePageLink : ""
                                            }`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            );
                        })}

                        {/* زر التالي */}
                        <li className={style.pageItem}>
                            <button
                                className={style.pageLink}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                »
                            </button>
                        </li>
                    </ul>
                </nav>






            </div>

            {/* /////////////////////////////////////////////// */}


            {showModal && (
                <>

                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0,0,0,0.65)",
                            backdropFilter: "blur(2px)",
                            zIndex: 999,
                        }}
                        onClick={() => setShowModal(false)}
                    />


                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "#0f0f0f",
                            padding: "25px",
                            borderRadius: "15px",
                            width: "450px",
                            maxWidth: "90%",
                            color: "white",
                            zIndex: 1000,
                            boxShadow: "0 0 15px #000",
                        }}
                    >
                        <span
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "15px",
                                cursor: "pointer",
                                fontSize: "28px",
                            }}
                            onClick={() => setShowModal(false)}
                        >
                            ×
                        </span>

                        <h3 className="totalFont" style={{ marginBottom: "20px" }}>
                            Add User
                        </h3>
                        <p>Create a new user account with role assignment</p>

                        <form onSubmit={formik.handleSubmit}>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between position-relative align-items-center mb-2">
                                    <label className="totalFont" htmlFor="firstName">
                                        First Name
                                    </label>

                                </div>

                                <div className="position-relative">
                                    <input
                                        name="firstName"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        id="firstName"
                                        type="text"
                                        placeholder="First Name"
                                        className="form-control my-2"
                                    />


                                </div>

                                {formik.touched.firstName && formik.errors.firstName && (
                                    <div className="text-danger small mt-1">
                                        {formik.errors.firstName}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between position-relative align-items-center mb-2">
                                    <label className="totalFont" htmlFor="lastName">
                                        Last Name
                                    </label>

                                </div>

                                <div className="position-relative">
                                    <input
                                        name="lastName"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        id="lastName"
                                        type="text"
                                        placeholder="Last Name"
                                        className="form-control my-2"
                                    />


                                </div>

                                {formik.touched.lastName && formik.errors.lastName && (
                                    <div className="text-danger small mt-1">
                                        {formik.errors.lastName}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <div className="d-flex justify-content-between position-relative align-items-center mb-2">
                                    <label className="totalFont" htmlFor="email">
                                        Email
                                    </label>

                                </div>

                                <div className="position-relative">
                                    <input
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        id="email"
                                        type="text"
                                        placeholder="Email"
                                        className="form-control my-2"
                                    />


                                </div>

                                {formik.touched.email && formik.errors.email && (
                                    <div className="text-danger small mt-1">
                                        {formik.errors.email}
                                    </div>
                                )}
                            </div>
                            <div className="dropdown mt-4">
                                <label className="totalFont mb-2" htmlFor="Role">
                                    Role
                                </label>
                                <button
                                    className="btn btn-light dropdown-toggle w-100 mb-4 d-flex justify-content-between align-items-center"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    data-bs-display="static"
                                    aria-expanded="false"
                                >
                                    <span>{formik.values.role || "Select a Role"}</span>
                                </button>

                                <ul className="dropdown-menu w-100"
                                    style={{
                                        maxHeight: "150px",
                                        overflowY: "auto"
                                    }}
                                >
                                    {allRoles.map((role) => (
                                        <li key={role.id}>
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    formik.setFieldValue("role", role.name);
                                                }}
                                            >
                                                {role.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>


                            <button
                                type="submit"
                                className={` ${style.saveBtn} totalFont w-100`}
                                disabled={!(formik.isValid && formik.dirty) || loading}
                            >
                                {loading ? (
                                    <span
                                        className="spinner-border spinner-border-sm text-light"
                                        role="status"
                                    />
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </form>
                    </div>
                </>
            )}

            {/* ///////////////////////////////////////// */}

            {showModal2 && (
                <>
                    {/* الخلفية المعتمة */}
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0,0,0,0.65)",
                            backdropFilter: "blur(2px)",
                            zIndex: 999,
                        }}
                        onClick={() => setShowModal2(false)}
                    />

                    {/* صندوق الـ Modal */}
                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "#0f0f0f",
                            padding: "25px",
                            borderRadius: "15px",
                            width: "450px",
                            maxWidth: "90%",
                            color: "white",
                            zIndex: 1000,
                            boxShadow: "0 0 15px #000",
                        }}
                    >
                        <span
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "15px",
                                cursor: "pointer",
                                fontSize: "28px",
                            }}
                            onClick={() => setShowModal2(false)}
                        >
                            ×
                        </span>

                        <h3 className="totalFont" style={{ marginBottom: "20px" }}>
                            Edit User
                        </h3>
                        <p>Edit user account with role assignment</p>

                        <form onSubmit={formik2.handleSubmit}>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between position-relative align-items-center mb-2">
                                    <label className="totalFont" htmlFor="firstName">
                                        First Name
                                    </label>

                                </div>

                                <div className="position-relative">
                                    <input
                                        name="firstName"
                                        value={formik2.values.firstName}
                                        onChange={formik2.handleChange}
                                        onBlur={formik2.handleBlur}
                                        id="firstName"
                                        type="text"
                                        placeholder="First Name"
                                        className="form-control my-2"
                                    />


                                </div>

                                {formik2.touched.firstName && formik2.errors.firstName && (
                                    <div className="text-danger small mt-1">
                                        {formik2.errors.firstName}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between position-relative align-items-center mb-2">
                                    <label className="totalFont" htmlFor="lastName">
                                        Last Name
                                    </label>

                                </div>

                                <div className="position-relative">
                                    <input
                                        name="lastName"
                                        value={formik2.values.lastName}
                                        onChange={formik2.handleChange}
                                        onBlur={formik2.handleBlur}
                                        id="lastName"
                                        type="text"
                                        placeholder="Last Name"
                                        className="form-control my-2"
                                    />


                                </div>

                                {formik2.touched.lastName && formik2.errors.lastName && (
                                    <div className="text-danger small mt-1">
                                        {formik2.errors.lastName}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <div className="d-flex justify-content-between position-relative align-items-center mb-2">
                                    <label className="totalFont" htmlFor="email">
                                        Email
                                    </label>

                                </div>

                                <div className="position-relative">
                                    <input
                                        name="email"
                                        value={formik2.values.email}
                                        onChange={formik2.handleChange}
                                        onBlur={formik2.handleBlur}
                                        id="email"
                                        type="text"
                                        placeholder="Email"
                                        className="form-control my-2"
                                    />


                                </div>

                                {formik2.touched.email && formik2.errors.email && (
                                    <div className="text-danger small mt-1">
                                        {formik2.errors.email}
                                    </div>
                                )}
                            </div>
                            <div className="dropdown mt-4">
                                <label className="totalFont mb-2" htmlFor="Role">
                                    Role
                                </label>
                                <button
                                    className="btn btn-light dropdown-toggle w-100 mb-4 d-flex justify-content-between align-items-center"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    data-bs-display="static"
                                    aria-expanded="false"
                                >
                                    <span>{formik2.values.role || "Select a Role"}</span>
                                </button>

                                <ul className="dropdown-menu w-100"
                                    style={{
                                        maxHeight: "150px",
                                        overflowY: "auto"
                                    }}
                                >
                                    {allRoles.map((role) => (
                                        <li key={role.id}>
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    formik2.setFieldValue("role", role.name);
                                                }}
                                            >
                                                {role.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>


                            <button
                                type="submit"
                                className={` ${style.saveBtn} totalFont w-100`}
                                disabled={!(formik2.isValid && formik2.dirty) || loading}
                            >
                                {loading ? (
                                    <span
                                        className="spinner-border spinner-border-sm text-light"
                                        role="status"
                                    />
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </form>
                    </div>
                </>
            )}



        </div >
        </>
    );
}

