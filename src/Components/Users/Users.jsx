
import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./users.module.css";
import api from "../../api";
import { userContext } from "../../context/userContext";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";

export default function Users() {
  const { userToken } = useContext(userContext);
  const [allusers, setallusers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [isOpenAddRole, setIsOpenAddRole] = useState(false);
  const [isOpenEditRole, setIsOpenEditRole] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchtext, setsearchtext] = useState("");

  const [Propertiesvalue, setPropertiesvalue] = useState([]);

  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("ASC");

  const [accountStatus, setAccountStatus] = useState("");
  const [activeStatus, setActiveStatus] = useState("");

  const placeholderText =
    Propertiesvalue.length === 0
      ? "Search Users..."
      : `Search by ${Propertiesvalue.includes("firstName") &&
        Propertiesvalue.includes("lastName")
        ? [
          "name",
          ...Propertiesvalue.filter(
            (i) => i !== "firstName" && i !== "lastName"
          ),
        ].join(" & ")
        : Propertiesvalue.join(" & ")
      }`;




  useEffect(() => {
    getAllUsers(1);
  }, [accountStatus, activeStatus, sortColumn, sortDirection, Propertiesvalue]);



  const handleSort = (column, direction) => {
    const col = column.toLowerCase();
    const dir = direction.toLowerCase();

    setSortColumn(col);
    setSortDirection(dir);


    getAllUsers(1, col, dir);
  };

  async function getAllUsers(
    page = currentPage,
    column = sortColumn,
    direction = sortDirection,
    searchValue = searchtext,
    activeProps = Propertiesvalue
  ) {
    try {
      const trimmedSearch = searchValue.trim();
      let activeProperties =
        activeProps.length === 0
          ? ["FirstName", "LastName", "Email", "Role"]
          : activeProps.map(p =>
            p.toLowerCase() === "firstname" ? "FirstName" :
              p.toLowerCase() === "lastname" ? "LastName" :
                p.toLowerCase() === "email" ? "Email" :
                  p.toLowerCase() === "role" ? "Role" : p
          );


      const nameParts = trimmedSearch.split(" ").filter(Boolean);


      if (
        nameParts.length >= 2 &&
        activeProperties.includes("FirstName") &&
        activeProperties.includes("LastName")
      ) {
        const first = nameParts[0];
        const last = nameParts[1];


        const res1 = await api.post(`/users/search`, {
          PageNumber: page,
          PageSize: 10,
          SearchProperties: ["FirstName"],
          SearchValue: first,
          BoolProperties: accountStatus && accountStatus !== "all" ? { IsDisabled: accountStatus === "disabled" } : {},
          ComplexProperties: activeStatus && activeStatus !== "all" ? { IsLocked: activeStatus === "inactive" } : {},
          SortDirection: direction.toUpperCase(),
          SortColumn: column === "name" ? null : column
        });


        const res2 = await api.post(`/users/search`, {
          PageNumber: page,
          PageSize: 10,
          SearchProperties: ["LastName"],
          SearchValue: last,
          BoolProperties: accountStatus && accountStatus !== "all" ? { IsDisabled: accountStatus === "disabled" } : {},
          ComplexProperties: activeStatus && activeStatus !== "all" ? { IsLocked: activeStatus === "inactive" } : {},
          SortDirection: direction.toUpperCase(),
          SortColumn: column === "name" ? null : column
        });


        const merged = [...res1.data.items, ...res2.data.items];
        const unique = merged.filter(
          (v, i, a) => a.findIndex(t => t.id === v.id) === i
        );

        setallusers(unique);
        setTotalPages(1);
        return;
      }


      let searchProperties = [];
      let searchValueString = "";
      if (trimmedSearch !== "") {
        searchValueString = trimmedSearch;
        if (activeProperties.includes("FirstName")) searchProperties.push("FirstName");
        if (activeProperties.includes("LastName")) searchProperties.push("LastName");
        if (activeProperties.includes("Email")) searchProperties.push("Email");
        if (activeProperties.includes("Role")) searchProperties.push("Role");
      }

      const boolProperties = {};
      const complexProperties = {};
      if (accountStatus && accountStatus !== "all") boolProperties["IsDisabled"] = accountStatus === "disabled";
      if (activeStatus && activeStatus !== "all") complexProperties["IsLocked"] = activeStatus === "inactive";

      const body = {
        PageNumber: page,
        PageSize: 10,
        SearchProperties: searchProperties,
        SearchValue: searchValueString,
        BoolProperties: boolProperties,
        ComplexProperties: complexProperties,
        SortDirection: direction.toUpperCase(),
        SortColumn: column === "name" ? null : column
      };

      // console.log("Payload sent to backend:", body);
      const response = await api.post(`/users/search`, body, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      let filteredUsers = response.data.items;


      if (column === "name") {
        filteredUsers.sort((a, b) => {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return direction === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
      }
      if (column === "email") filteredUsers.sort((a, b) =>
        direction === "asc" ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email)
      );
      if (column === "Role") filteredUsers.sort((a, b) =>
        direction === "asc" ? a.Role.localeCompare(b.Role) : b.Role.localeCompare(a.Role)
      );
      if (column === "createdOn") filteredUsers.sort((a, b) =>
        direction === "asc" ? a.createdOn.localeCompare(b.createdOn) : b.createdOn.localeCompare(a.createdOn)
      );

      setallusers(filteredUsers);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
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
      const { data } = await api.post(`/Roles/search?pageNumber=${page}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      // console.log(data);
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
      text: `Do you want to ${user.isDisabled ? "Unlock" : "Lock"} this user: ${user.email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm",
      cancelButtonText: "Cancel",
      background: "#FAF8F6",
      color: "#1C1814",
      confirmButtonColor: "#2D0B14",
      cancelButtonColor: "#8C8581",
      customClass: {
        popup: "custom-popup",
      },
    });

    if (!result.isConfirmed) {
      toast("Operation cancelled — No changes were made", {
        background: "#FAF8F6",
        color: "#1C1814",
      });
      return;
    }

    try {
      await api.put(
        `/users/${user.id}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      setallusers((prev) =>
        prev.map((u) =>
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
      getAllUsers();
      getAllRoles();
    }
  }, [userToken]);
  useEffect(() => {
    if (searchtext.trim() === "" && userToken) {
      // setPropertiesvalue([]);
      getAllUsers(1);
    }
  }, [searchtext, userToken]);

  let [loading, setLoading] = useState(false);
  async function submit(values, { resetForm }) {
    // console.log(values);
    try {
      setLoading(true);
      const response = await api.post("/users", values, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      toast.success("user add successfully");
      getAllUsers();
      setShowModal(false);

      resetForm();
    } catch (error) {
      console.log("Error:", error);
      toast.error(
        error.response?.data?.errors?.[1] ||
        "Something went wrong while creating user."
      );
    } finally {
      setLoading(false);
    }
  }
  function openAddModal() {
    formik.resetForm();
    setShowModal(true);
  }

  const validationLogin = yup.object({
    firstName: yup
      .string()
      .required("First name is required")
      .min(3, "first name must be at least 3 characters long")
      .max(100, "first name must be at maximum 100 characters long"),
    lastName: yup
      .string()
      .required("Last name is required")
      .min(3, "last name must be at least 3 characters long")
      .max(100, "last name must be at maximum 100 characters long"),
    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email address")
      .max(256, "email must be at maximum 256 characters long"),
    role: yup.string().required("Role is required").min(1, "Role is required"), // مجرد تحقق بسيط
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
    validateOnMount: true,
  });

  async function EditSubmit(values) {
    try {
      setLoading(true);

      const response = await api.put(`/users/${selectedUser.id}`, values, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      toast.success("User updated successfully");

      // تحديث البيانات محلياً
      setallusers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, ...values } : u))
      );

      setShowModal2(false);
    } catch (error) {
      console.log("Error:", error);
      toast.error(
        error.response?.data?.errors?.[1] ||
        "Something went wrong while registration."
      );
    } finally {
      setLoading(false);
    }
  }

  let formik2 = useFormik({
    initialValues: selectedUser
      ? {
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        email: selectedUser.email || "",
        role: selectedUser.role || "",
      }
      : {
        firstName: "",
        lastName: "",
        email: "",
        role: "",
      },
    validationSchema: validationLogin,
    onSubmit: EditSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (showModal2 && selectedUser) {
      formik2.setValues({
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        email: selectedUser.email || "",
        role: selectedUser.role || "",
      });

      formik2.initialValues = {
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        email: selectedUser.email || "",
        role: selectedUser.role || "",
      };
    }
  }, [showModal2, selectedUser]);

  return (
    <>
      <div className={style.rolesPage}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className={`${style.rolesH} totalFont`}>Users</h2>
          <button
            onClick={openAddModal}
            className={`${style.RoleButton} totalFont`}
          >
            <i className="fa-solid fa-circle-plus"></i> Add User
          </button>
        </div>

        <div className={style.rolesTable}>
          <div className={style.innerTable}>
            <div className={style.searchContainer}>
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <form className={` ${style.formm} d-flex flex-grow-1`} style={{ minWidth: "280px" }}>
                  <input
                    className={style.searchInput}
                    type="search"
                    placeholder={placeholderText}
                    aria-label="Search"
                    onChange={(e) => setsearchtext(e.target.value)}
                    value={searchtext}
                  />
                  <button
                    onClick={search}
                    className={`${style.UserButton} totalFont`}
                  >
                    Search
                  </button>
                </form>

                <div className={style.selection}>
                  <select
                    value={activeStatus}
                    onChange={(e) => setActiveStatus(e.target.value)}
                    className={style.filterSelect}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select
                    value={accountStatus}
                    onChange={(e) => setAccountStatus(e.target.value)}
                    className={style.filterSelect}
                  >
                    <option value="all">All Accounts</option>
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={style.tableWrapper}>
              <table className={style.realTable}>
                <thead>
                  <tr>
                    <th className="totalFont" style={{ width: "13%" }}>
                      <div className={style.sortingContainer}>
                        Name
                        <input
                          type="checkbox"
                          className={style.checkboxx}
                          checked={
                            Propertiesvalue.includes("firstName") &&
                            Propertiesvalue.includes("lastName")
                          }
                          onChange={() => {
                            if (
                              Propertiesvalue.includes("firstName") &&
                              Propertiesvalue.includes("lastName")
                            ) {
                              setPropertiesvalue((prev) =>
                                prev.filter(
                                  (i) => i !== "firstName" && i !== "lastName"
                                )
                              );
                            } else {
                              setPropertiesvalue((prev) => [
                                ...prev,
                                "firstName",
                                "lastName",
                              ]);
                            }
                          }}
                        />
                        <button
                          className={`${style.sortBtn} btn p-0 m-0 border-0`}
                          data-tooltip="Sort ascending"
                          onClick={() => handleSort("name", "ASC")}
                        >
                          ▲
                        </button>
                        <button
                          className={`${style.sortBtn} btn p-0 m-0 border-0`}
                          data-tooltip="Sort descending"
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
                          className={style.checkboxx}
                          checked={Propertiesvalue.includes("email")}
                          onChange={() => handleSelect(["email"])}
                        />
                        <button
                          className={`${style.sortBtn} btn p-0 m-0 border-0`}
                          data-tooltip="Sort ascending"
                          onClick={() => handleSort("email", "ASC")}
                        >
                          ▲
                        </button>
                        <button
                          className={`${style.sortBtn} btn p-0 m-0 border-0`}
                          data-tooltip="Sort descending"
                          onClick={() => handleSort("email", "DESC")}
                        >
                          ▼
                        </button>
                      </div>
                    </th>
                    <th className="totalFont" style={{ width: "13%" }}>
                      <div className={style.sortingContainer}>
                        Role
                        <input
                          type="checkbox"
                          className={style.checkboxx}
                          checked={Propertiesvalue.includes("Role")}
                          onChange={() => handleSelect(["Role"])}
                        />

                        <button
                          className={`${style.sortBtn} btn p-0 m-0 border-0`}
                          data-tooltip="Sort ascending"
                          onClick={() => handleSort("Role", "ASC")}
                        >
                          ▲
                        </button>

                        <button
                          className={`${style.sortBtn} btn p-0 m-0 border-0`}
                          data-tooltip="Sort descending"
                          onClick={() => handleSort("Role", "DESC")}
                        >
                          ▼
                        </button>
                      </div>
                    </th>

                    <th className="totalFont" style={{ width: "15%" }}>
                      Created On

                      <button
                        className={`${style.sortBtn} btn p-0 m-0 border-0 ms-1`}
                        data-tooltip="Sort ascending"
                        onClick={() => handleSort("createdOn", "ASC")}
                      >
                        ▲
                      </button>

                      <button
                        className={`${style.sortBtn} btn p-0 m-0 border-0`}
                        data-tooltip="Sort descending"
                        onClick={() => handleSort("createdOn", "DESC")}
                      >
                        ▼
                      </button>
                    </th>
                    <th className="totalFont" style={{ width: "13%" }}>
                      Edit
                    </th>
                    <th className="totalFont" style={{ width: "13%" }}>
                      Status
                    </th>
                    <th className="totalFont" style={{ width: "13%" }}>
                      Is Disabled
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allusers.map((user) => (
                    <tr key={user.id}>
                      <td data-label="Name">
                        <Link
                          className={`${style.userlink}`}
                          to={`/dashboard/users/${user.id}`}
                        >{`${user.firstName} ${user.lastName}`}</Link>
                      </td>
                      <td data-label="Email">{user.email}</td>
                      <td data-label="Role">{user.role}</td>
                      <td data-label="Created On">
                        {user.createdOn &&
                          (() => {
                            const date = new Date(user.createdOn);
                            const formattedTime = date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            });
                            const formattedDate = date.toLocaleDateString();
                            return (
                              <>
                                <span>{formattedTime}</span>
                                <br />
                                <span>{formattedDate}</span>
                              </>
                            );
                          })()}
                      </td>

                      <td>
                        <button
                          className={`${style.editebtn}`}
                          onClick={() => {
                            setSelectedUser(user);
                            formik2.setValues({
                              firstName: user.firstName,
                              lastName: user.lastName,
                              email: user.email,

                              role:
                                typeof user.role === "string"
                                  ? user.role
                                  : user.role?.name || "",
                            });
                            setShowModal2(true);
                          }}
                        >
                          <i className="fa-regular fa-pen-to-square"></i>edit
                        </button>
                      </td>
                      <td>
                        <button
                          disabled={user.isLocked === false} // Active → disabled
                          onClick={async () => {
                            try {
                              const result = await Swal.fire({
                                title: "Change Status?",
                                text: `Do you want to change status for ${user.email}?`,
                                icon: "question",
                                showCancelButton: true,
                                confirmButtonText: "Yes, change",
                                cancelButtonText: "Cancel",
                                background: "#FAF8F6",
                                color: "#1C1814",
                                confirmButtonColor: "#2D0B14",
                                cancelButtonColor: "#8C8581",
                              });

                              if (!result.isConfirmed) {
                                toast(
                                  "Operation cancelled — No changes were made",
                                  {
                                    background: "#FAF8F6",
                                    color: "#1C1814",
                                  }
                                );
                                return;
                              }

                              await api.put(
                                `/users/${user.id}/unlock`,
                                {},
                                {
                                  headers: {
                                    Authorization: `Bearer ${userToken}`,
                                  },
                                }
                              );

                              setallusers((prev) =>
                                prev.map((u) =>
                                  u.id === user.id
                                    ? { ...u, isLocked: !u.isLocked }
                                    : u
                                )
                              );

                              toast.success(
                                `${user.email} is now ${user.isLocked ? "Active" : "Inactive"
                                }`
                              );
                            } catch (err) {
                              console.log("Status error:", err);
                              toast.error("Error updating user status");
                            }
                          }}
                          className={`${user.isLocked ? style.inactivebtn : style.activebtn
                            } totalFont`}
                        >
                          {user.isLocked ? "Inactive" : "Active"}
                        </button>
                      </td>

                      <td>
                        <button
                          onClick={() => handleToggleUser(user)}
                          className={`${user.isDisabled
                            ? style.lockIcon
                            : style.openlockIcon
                            } totalFont`}
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
                  disabled={
                    currentPage === 1 ||
                    totalPages === 0 ||
                    allusers.length === 0
                  }
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

              <li className={style.pageItem}>
                <button
                  className={style.pageLink}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={
                    currentPage === totalPages ||
                    totalPages === 0 ||
                    allusers.length === 0
                  }
                >
                  »
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* /////////////////////////////////////////////// */}

        {showModal && (
          <div className={style.modalOverlay} onClick={() => setShowModal(false)}>
            <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={style.closeModalBtn} onClick={() => setShowModal(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>

              <h3 className="totalFont" style={{ color: "#2D0B14" }}>Add User</h3>
              <p className="totalFont" style={{ color: "#000000d1" }}>Create a new user account with role assignment</p>

              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label className={style.modalLabel} htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    className={style.modalInput}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <div className="text-danger small mt-1">
                      {formik.errors.firstName}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className={style.modalLabel} htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    className={style.modalInput}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <div className="text-danger small mt-1">
                      {formik.errors.lastName}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className={style.modalLabel} htmlFor="email">
                    Email
                  </label>
                  <input
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="email"
                    type="text"
                    placeholder="Email"
                    className={style.modalInput}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-danger small mt-1">
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className={style.modalLabel} htmlFor="role">
                    Role
                  </label>
                  <div className="dropdown">
                    <button
                      className={`btn ${style.dropdownToggle}`}
                      type="button"
                      onClick={() => setIsOpenAddRole(!isOpenAddRole)}
                      aria-expanded={isOpenAddRole}
                    >
                      <span>{formik.values.role || "Select a Role"}</span>
                      <i className="fa-solid fa-chevron-down ms-2"></i>
                    </button>

                    <ul className={`dropdown-menu w-100 ${style.dropdownMenu} ${isOpenAddRole ? 'show' : ''}`} style={{ maxHeight: "150px", overflowY: "auto", display: isOpenAddRole ? 'block' : 'none' }}>
                      {allRoles.map((role) => (
                        <li key={role.id}>
                          <a
                            className={`dropdown-item ${style.dropdownItem}`}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              formik.setFieldValue("role", role.name);
                              setIsOpenAddRole(false);
                            }}
                          >
                            {role.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="submit"
                  className={style.saveBtn}
                  disabled={!(formik.isValid && formik.dirty) || loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm text-light" role="status" />
                  ) : (
                    "Save"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ///////////////////////////////////////// */}

        {showModal2 && (
          <div className={style.modalOverlay} onClick={() => setShowModal2(false)}>
            <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={style.closeModalBtn} onClick={() => setShowModal2(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>

              <h3 className="totalFont">Edit User</h3>
              <p>Edit user account with role assignment</p>

              <form onSubmit={formik2.handleSubmit}>
                <div className="mb-3">
                  <label className={style.modalLabel} htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={formik2.values.firstName}
                    onChange={formik2.handleChange}
                    onBlur={formik2.handleBlur}
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    className={style.modalInput}
                  />
                  {formik2.touched.firstName && formik2.errors.firstName && (
                    <div className="text-danger small mt-1">
                      {formik2.errors.firstName}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className={style.modalLabel} htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={formik2.values.lastName}
                    onChange={formik2.handleChange}
                    onBlur={formik2.handleBlur}
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    className={style.modalInput}
                  />
                  {formik2.touched.lastName && formik2.errors.lastName && (
                    <div className="text-danger small mt-1">
                      {formik2.errors.lastName}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className={style.modalLabel} htmlFor="email">
                    Email
                  </label>
                  <input
                    name="email"
                    value={formik2.values.email}
                    onChange={formik2.handleChange}
                    onBlur={formik2.handleBlur}
                    id="email"
                    type="text"
                    placeholder="Email"
                    className={style.modalInput}
                  />
                  {formik2.touched.email && formik2.errors.email && (
                    <div className="text-danger small mt-1">
                      {formik2.errors.email}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className={style.modalLabel} htmlFor="role">
                    Role
                  </label>
                  <div className="dropdown">
                    <button
                      className={`btn ${style.dropdownToggle}`}
                      type="button"
                      onClick={() => setIsOpenEditRole(!isOpenEditRole)}
                      aria-expanded={isOpenEditRole}
                    >
                      <span>{formik2.values.role || "Select a Role"}</span>
                      <i className="fa-solid fa-chevron-down ms-2"></i>
                    </button>

                    <ul className={`dropdown-menu w-100 ${style.dropdownMenu} ${isOpenEditRole ? 'show' : ''}`} style={{ maxHeight: "150px", overflowY: "auto", display: isOpenEditRole ? 'block' : 'none' }}>
                      {allRoles.map((role) => (
                        <li key={role.id}>
                          <a
                            className={`dropdown-item ${style.dropdownItem}`}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              formik2.setFieldValue("role", role.name);
                              setIsOpenEditRole(false);
                            }}
                          >
                            {role.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="submit"
                  className={style.saveBtn}
                  disabled={!(formik2.isValid && formik2.dirty) || loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm text-light" role="status" />
                  ) : (
                    "Save"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

