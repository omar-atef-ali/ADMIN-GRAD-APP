
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

  // async function getAllUsers(
  //   page = currentPage,
  //   column = sortColumn,
  //   direction = sortDirection,
  //   searchValue = searchtext,
  //   activeProps = Propertiesvalue
  // ) {
  //   try {
  //     const trimmedSearch = searchValue.trim();


  //     let activeProperties =
  //       activeProps.length === 0
  //         ? ["FirstName", "LastName", "Email","Role"]
  //         : activeProps.map(p =>
  //             p.toLowerCase() === "firstname" ? "FirstName" :
  //             p.toLowerCase() === "lastname" ? "LastName" :
  //             p.toLowerCase() === "email" ? "Email" :
  //             p.toLowerCase() === "role" ? "Role" : p
  //           );

  //     let searchProperties = [];
  //     let searchValueString = "";
  //     if (trimmedSearch !== "") {
  //       searchValueString = trimmedSearch;
  //       if (activeProperties.includes("FirstName")) searchProperties.push("FirstName");
  //       if (activeProperties.includes("LastName")) searchProperties.push("LastName");
  //       if (activeProperties.includes("Email")) searchProperties.push("Email");
  //       if (activeProperties.includes("Role")) searchProperties.push("Role");
  //     }

  //     const boolProperties = {};
  //     const complexProperties = {};
  //     if (accountStatus && accountStatus !== "all") boolProperties["IsDisabled"] = accountStatus === "disabled";
  //     if (activeStatus && activeStatus !== "all") complexProperties["IsLocked"] = activeStatus === "inactive";

  //     const body = {
  //       PageNumber: page,
  //       PageSize: 10,
  //       SearchProperties: searchProperties,
  //       SearchValue: searchValueString,
  //       BoolProperties: boolProperties,
  //       ComplexProperties: complexProperties,
  //       SortDirection: direction.toUpperCase(), 
  //       SortColumn: column === "name" ? null : column, 
  //     };

  //     console.log("Payload sent to backend:", body); 
  //     const response = await api.post(`/users/search`, body, {
  //       headers: { Authorization: `Bearer ${userToken}` },
  //     });

  //     let filteredUsers = response.data.items;

  //     if (column === "name") {
  //       filteredUsers.sort((a, b) => {
  //         const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
  //         const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
  //         return direction === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  //       });
  //     }

  //     if (column === "email") {
  //       filteredUsers.sort((a, b) => {
  //         return direction === "asc"
  //           ? a.email.localeCompare(b.email)
  //           : b.email.localeCompare(a.email);
  //       });
  //     }
  //     if (column === "Role") {
  //       filteredUsers.sort((a, b) => {
  //         return direction === "asc"
  //           ? a.Role.localeCompare(b.Role)
  //           : b.Role.localeCompare(a.Role);
  //       });
  //     }
  //     if (column === "createdOn") {
  //       filteredUsers.sort((a, b) => {
  //         return direction === "asc"
  //           ? a.createdOn.localeCompare(b.createdOn)
  //           : b.createdOn.localeCompare(a.createdOn);
  //       });
  //     }

  //     setallusers(filteredUsers);
  //     setTotalPages(response.data.totalPages);

  //   } catch (error) {
  //     console.log("ERROR:", error.response?.data || error.message);
  //   }
  // }

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

      console.log("Payload sent to backend:", body);
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
      text: `Do you want to ${user.isDisapled ? "Unlock" : "Lock"} this user: ${user.email
        }?`,
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
      },
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
    console.log(values);
    try {
      setLoading(true);
      const response = await api.post("/users", values, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      toast.success("user add successfully");
      getAllUsers();

      resetForm();
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
      <div className={` container-fluid ${style.rolesPage}`}>
        <div className=" d-flex justify-content-between">
          <h2 className={`${style.rolesH} totalFont`}>Users</h2>
          <button
            onClick={openAddModal}
            className={`${style.RoleButton} totalFont  col-6 col-md-4 col-lg-2`}
          >
            <i className="fa-solid fa-circle-plus"></i> Add User
          </button>
        </div>

        <div className={`${style.rolesTable}`}>
          <div className={`${style.innerTable}`}>
            <div className={`${style.searchContainer} `}>
              <div className="d-flex row">
                <form className="d-flex col-12 col-md-8" >
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder={placeholderText}
                    aria-label="Search"
                    onChange={(e) => setsearchtext(e.target.value)}
                    value={searchtext}
                    // style={{ width: "65%" }}
                   
                  />
                  <button
                    onClick={search}
                    className={`${style.UserButton} totalFont`}
                  
                  >
                    Search
                  </button>


                </form>

                <div className={`d-flex col-4 col-md-4 ${style.selection}`}>
                <select
                  value={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.value)}
                  style={{
                    backgroundColor: "#555",
                    color: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #444",
                    padding: "5px 10px",
                    outline: "none",
                    // width: "105px", // عرض أصغر
                    // marginLeft: "15px",
                    
                  }}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select
                  value={accountStatus}
                  onChange={(e) => setAccountStatus(e.target.value)}
                  style={{
                    backgroundColor: "#555",
                    color: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #444",
                    padding: "5px 10px",
                    outline: "none",
                    // width: "105px", // عرض أصغر
                    marginLeft: "15px",
                  }}

                >
                  <option value="all">All</option>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
                </div>
              </div>

              
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
                          className={`${style.checkboxx}`}
                          style={{ marginLeft: "6px" }}
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
                          className={`${style.checkboxx}`}
                          style={{ marginLeft: "6px" }}
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

                    <th className="totalFont" style={{ width: "13%" }}>
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
                      Is Disapled
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
                                background: "#1f1f1f",
                                color: "#fff",
                                confirmButtonColor: "rgb(10, 104, 159)",
                                cancelButtonColor: "#646262ff",
                              });

                              if (!result.isConfirmed) {
                                toast(
                                  "Operation cancelled — No changes were made"
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

                  <ul
                    className="dropdown-menu w-100"
                    style={{
                      maxHeight: "150px",
                      overflowY: "auto",
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

                  <ul
                    className="dropdown-menu w-100"
                    style={{
                      maxHeight: "150px",
                      overflowY: "auto",
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
      </div>
    </>
  );
}

