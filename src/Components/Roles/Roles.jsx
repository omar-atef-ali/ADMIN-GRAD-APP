import React, { useContext, useEffect, useState } from "react";
import style from "./Roles.module.css";
import api from "../../api";
import { userContext } from "../../context/userContext";
import * as yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function Roles() {
  const { userToken } = useContext(userContext);
  const [showModal, setShowModal] = useState(false);

  const [allRoles, setAllRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const permissions = [
    "Users:Read",
    "Users:Add",
    "Users:Update",
    "Roles:Read",
    "Roles:Add",
    "Roles:Update",
  ];
  const [selected, setSelected] = useState({});

  const handleToggle = (permName, field) => {
    setSelected((prev) => {
      const newValue = {
        ...prev,
        [permName]: {
          ...prev[permName],
          [field]: !prev[permName]?.[field],
        },
      };

      // لو غيرنا الـ Add لـ false → نجبر Inheritable على false كمان
      if (field === "add" && !newValue[permName].add) {
        newValue[permName].inheritable = false;
      }

      return newValue;
    });
  };

  const buildPermissionsArray = () => {
    const result = [];

    permissions.forEach((perm) => {
      const item = selected[perm];

      // لو Add مش متعلم → متعملش حاجة
      if (item?.add) {
        result.push({
          name: perm,
          isInheritable: item.inheritable === true,
        });
      }
    });

    return result;
  };

  //////////////////////////////////////////////////
  const [showModal2, setShowModal2] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [editSelected, setEditSelected] = useState({});

  const handleEditClick = async (roleId) => {
    try {
      // جلب الـ Role بالتفاصيل
      const { data } = await api.get(`/Roles/${roleId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setCurrentRole(data);

      const permissionsState = permissions.reduce((acc, perm) => {
        const found = data.permissions.find((p) => p.name === perm);
        acc[perm] = {
          add: found ? true : false,
          inheritable: found ? found.isInheritable : false,
        };
        return acc;
      }, {});

      setEditSelected(permissionsState);
      setShowModal2(true);
    } catch (error) {
      console.log("Error fetching role:", error);
      toast.error("Failed to fetch role details.", {
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
      });
    }
  };

  const handleToggleEdit = (permName, field) => {
    setEditSelected((prev) => {
      const newValue = {
        ...prev,
        [permName]: {
          ...prev[permName],
          [field]: !prev[permName]?.[field],
        },
      };

      // لو غيرنا الـ Add لـ false → نجبر Inheritable على false
      if (field === "add" && !newValue[permName].add) {
        newValue[permName].inheritable = false;
      }

      return newValue;
    });
  };

  const buildEditPermissionsArray = () => {
    const result = [];

    permissions.forEach((perm) => {
      const item = editSelected[perm];

      if (item?.add) {
        result.push({
          name: perm,
          isInheritable: item.inheritable === true,
        });
      }
    });

    return result;
  };

  let [loading2, setLoading2] = useState(false);

  const submitEdit = async () => {
    try {
      setLoading2(true);
      const permissionsArray = buildEditPermissionsArray();

      const body = {
        name: currentRole.name,
        permissions: permissionsArray,
      };

      console.log("EDIT BODY:", body);

      await api.put(`/Roles/${currentRole.id}`, body, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      toast.success("Role updated successfully");
      setLoading2(false);

      setShowModal2(false);
      getAllRoles();
    } catch (error) {
      console.log("Edit error:", error);
      toast.error("Failed to update role", {
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
      });
    }
  };

  ///////////////////////////////////////////////////////

  async function getAllRoles(page = currentPage) {
    try {
      const { data } = await api.get(
        `/Roles?pageNumber=${page}&includeDisabledRoles=true&SearchProperties=name&SearchValue=${searchText}&SortColumn=Name&SortDirection=${sortDirection}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      // console.log(data);
      setAllRoles(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.errors[1] || "Something went wrong.", {
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
      });
    }
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    getAllRoles(page);
  };

  useEffect(() => {
    if (userToken) {
      getAllRoles();
    }
  }, [userToken]);

  //////////////////////////////////////////////////////////////////////

  let [loading, setLoading] = useState(false);
  async function submit(values) {
    try {
      setLoading(true);
      const permissionsArray = buildPermissionsArray();
      const body = {
        name: values.name, // اسم الرول اللي من الفورم

        permissions: permissionsArray,
      };
      console.log(body);

      const response = await api.post("/Roles", body, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      // console.log("Success:", response.data);
      toast.success("Role added successfully");
      setShowModal(false);
      getAllRoles();
    } catch (error) {
      toast.error(
        error.response?.data?.errors[1] ||
          "Something went wrong while adding a role.",
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
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  let validationLogin = yup.object({
    name: yup.string().min(3, "Role name must be at least 3 characters long"),
  });

  let formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: validationLogin,
    onSubmit: submit,
  });

  ///////////////////////////////////////////////////////////////////
  const [searchText, setSearchText] = useState("");

  async function Search(e) {
    e.preventDefault();
    try {
      await getAllRoles();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (searchText.trim() === "" && userToken) {
      getAllRoles(1);
    }
  }, [searchText, userToken]);

  ///////////////////////////////////////////////////////////////////

  const [sortDirection, setSortDirection] = useState("");
  async function handleSort(direction) {
    if (direction == "ASC") {
      setSortDirection("ASC");
    } else {
      setSortDirection("DESC");
    }
  }
  useEffect(() => {
    if (sortDirection && userToken) {
      getAllRoles();
    }
  }, [sortDirection, userToken]);

  return (
    <>
      <div className={` container-fluid ${style.rolesPage}`}>
        <div className=" d-flex justify-content-between">
          <h2 className={`${style.rolesH} totalFont`}>Roles</h2>
          <button
            onClick={() => setShowModal(true)}
            className={`${style.RoleButton} totalFont  col-6 col-md-4 col-lg-2`}
          >
            <i className="fa-solid fa-circle-plus"></i> Add Role
          </button>
        </div>

        <div className={`${style.rolesTable} `}>
          <div className={`${style.innerTable} `}>
            <div className={`${style.searchContainer} `}>
              <form className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder=" Search Roles..."
                  aria-label="Search"
                />
                <button
                  type="button"
                  onClick={Search}
                  className={`${style.UserButton}  totalFont  col-3 col-md-2 col-lg-1`}
                >
                  Search
                </button>
              </form>
            </div>

            <table className={`${style.realTable}  table-bordered `}>
              <thead>
                <tr>
                  <th
                    className={` ${style.roleheader} totalFont d-flex align-items-center gap-1`}
                  >
                    Role Name
                    <span className={`${style.roleheaderbuttons}`}>
                      <button
                        type="button"
                        className={`${style.sortBtn} btn p-0 m-0 border-0 `}
                        onClick={() => handleSort("ASC")}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className={`${style.sortBtn} btn p-0 m-0 border-0 `}
                        onClick={() => handleSort("DESC")}
                      >
                        ▼
                      </button>
                    </span>
                  </th>
                  <th className="totalFont" style={{ width: "20%" }}>
                    Edit
                  </th>
                  <th className="totalFont" style={{ width: "20%" }}>
                    Is Disabled
                  </th>
                </tr>
              </thead>
              <tbody>
                {allRoles.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Link className={`${style.userlink}`} to={`${item.id}`}>
                        {item.name}
                      </Link>
                    </td>
                    <td onClick={() => handleEditClick(item.id)}>
                      <button className={`${style.editTd}`}>
                        <i className="fa-regular fa-pen-to-square"></i>
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: "Are you sure?",
                            text: `Do you want to ${
                              item.isDisabled ? "Unlock" : "Lock"
                            } this user: ${item.name}?`,
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
                            toast(
                              "Operation cancelled — No changes were made",
                              {
                                background: "#1f1f1f",
                                color: "#fff",
                              }
                            );
                            return;
                          }
                          try {
                            await api.put(
                              `/Roles/${item.id}/toggle-status`,
                              {},
                              {
                                headers: {
                                  Authorization: `Bearer ${userToken}`,
                                },
                              }
                            );

                            setAllRoles((prev) =>
                              prev.map((u) =>
                                u.id === item.id
                                  ? { ...u, isDisabled: !u.isDisabled }
                                  : u
                              )
                            );
                            toast.success(
                              `${item.name} is now ${
                                !item.isDisabled ? "Locked" : "Unlocked"
                              }`
                            );
                          } catch (err) {
                            console.log("Toggle error:", err);
                          }
                        }}
                        className={`${
                          item.isDisabled ? style.lockIcon : style.openlockIcon
                        } totalFont mx-3`}
                      >
                        {item.isDisabled ? (
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

          {/* ////////////////////////////////////////// */}

          <nav
            className={style.paginationContainer}
            aria-label="Page navigation"
          >
            <ul className={style.paginationList}>
              {/* زر السابق */}
              <li className={style.pageItem}>
                <button
                  className={style.pageLink}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
              </li>

              {/* أزرار الصفحات ديناميكي */}
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <li key={page} className={style.pageItem}>
                    <button
                      className={`${style.pageLink} ${
                        currentPage === page ? style.activePageLink : ""
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

        {/* ////////////////////////////////////////////////////// */}

        {showModal && (
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
              onClick={() => setShowModal(false)}
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
                onClick={() => setShowModal(false)}
              >
                ×
              </span>

              <h3 className="totalFont" style={{ marginBottom: "20px" }}>
                Add Role
              </h3>

              <form onSubmit={formik.handleSubmit}>
                <label className="totalFont" htmlFor="name">
                  Role Name
                </label>
                <input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="name"
                  type="text"
                  placeholder="Role Name"
                  className="form-control my-2"
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-danger small mt-1">
                    {formik.errors.name}
                  </div>
                )}

                <div className={`${style.allDiv}`}>
                  <div className={`${style.PermissionsDiv}`}>
                    <h5 className="totalFont">Permissions</h5>
                    <p className="totalFont">Users:Read</p>
                    <p className="totalFont">Users:Add</p>
                    <p className="totalFont">Users:Update</p>
                    <p className="totalFont">Roles:Read</p>
                    <p className="totalFont">Roles:Add</p>
                    <p className="totalFont">Roles:Update</p>
                  </div>

                  {/* ----------------- ADD COLUMN ------------------- */}
                  <div className={style.addDiv}>
                    <h5 className="totalFont">Add</h5>

                    {permissions.map((perm, index) => (
                      <div className="mb-3" key={index}>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selected[perm]?.add || false}
                            onChange={() => handleToggle(perm, "add")}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ----------------- INHERITABLE COLUMN ------------------- */}
                  <div className={style.inheritableDiv}>
                    <h5 className="totalFont">Inheritable</h5>

                    {permissions.map((perm, index) => (
                      <div className="mb-3 mx-4" key={index}>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selected[perm]?.inheritable || false}
                            onChange={() => handleToggle(perm, "inheritable")}
                            disabled={!selected[perm]?.add}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className={` ${style.saveBtn} totalFont w-100`}
                  disabled={!(formik.isValid && formik.dirty) || loading}
                  onClick={() => {
                    const finalPermissions = buildPermissionsArray();
                    console.log(finalPermissions);
                  }}
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

        {/* //////////////////////////////////////////////////////// */}
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
                Edit Role
              </h3>
              <p className=" fw-medium fs-4">{currentRole.name}</p>

              <div className={`${style.allDiv}`}>
                <div className={`${style.PermissionsDiv}`}>
                  <h5 className="totalFont">Permissions</h5>
                  <p className="totalFont">Users:Read</p>
                  <p className="totalFont">Users:Add</p>
                  <p className="totalFont">Users:Update</p>
                  <p className="totalFont">Roles:Read</p>
                  <p className="totalFont">Roles:Add</p>
                  <p className="totalFont">Roles:Update</p>
                </div>

                {/* ----------------- ADD COLUMN ------------------- */}
                <div className={style.addDiv}>
                  <h5 className="totalFont">Add</h5>

                  {permissions.map((perm) => (
                    <div key={perm} className="mb-3">
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={editSelected[perm]?.add || false}
                          onChange={() => handleToggleEdit(perm, "add")}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* ----------------- INHERITABLE COLUMN ------------------- */}
                <div className={style.inheritableDiv}>
                  <h5 className="totalFont">Inheritable</h5>

                  {permissions.map((perm) => (
                    <div key={perm} className="mb-3 mx-4">
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={editSelected[perm]?.inheritable || false}
                          onChange={() => handleToggleEdit(perm, "inheritable")}
                          disabled={!editSelected[perm]?.add}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`${style.saveBtn} totalFont w-100`}
                onClick={submitEdit}
                disabled={loading2}
              >
                {loading2 ? (
                  <span
                    className="spinner-border spinner-border-sm text-light"
                    role="status"
                  />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
