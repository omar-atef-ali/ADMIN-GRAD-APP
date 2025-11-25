import React, { useContext, useEffect, useState } from "react";
import style from "./Roles.module.css";
import api from "../../api";
import { userContext } from "../../context/userContext";
import * as yup from "yup";
import { useFormik } from "formik";

export default function Roles() {
  const { userToken } = useContext(userContext);
  const [showModal, setShowModal] = useState(false);
  const [allRoles, setAllRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const permissions = [
    "Users:Read",
    "Users:Create",
    "Users:Update",
    "Users:Delete",
    "Roles:Read",
    "Roles:Create",
    "Roles:Update",
    "Roles:Delete",
  ];
  const [selected, setSelected] = useState({});

  const handleToggle = (permName, field) => {
    setSelected((prev) => ({
      ...prev,
      [permName]: {
        ...prev[permName],
        [field]: !prev[permName]?.[field],
      },
    }));
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

  //////////////////////

  async function getAllRoles(page = currentPage) {
    try {
      const { data } = await api.get(`/Roles?pageNumber=${page}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log(data);
      setAllRoles(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    }
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    getAllRoles(page);
  };

  useEffect(() => {
    getAllRoles();
  }, [userToken]);

  ///////////////////////////////////////
  let [loading, setLoading] = useState(false);
  async function submit(values) {
    try {
      setLoading(true);
      const permissionsArray = buildPermissionsArray();
      const body = {
        name: values.roleName, // اسم الرول اللي من الفورم
        permissions: permissionsArray,
      };
      const response = await api.post("/Roles", body);
      console.log("Success:", response.data);
    } catch (error) {
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

        <div className={`${style.rolesTable}`}>
          <div className={`${style.innerTable}`}>
            <div className={`${style.searchContainer} `}>
              <form className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder=" Search Roles..."
                  aria-label="Search"
                />
                <button
                  className={`${style.UserButton} totalFont  col-3 col-md-2 col-lg-1`}
                >
                  Searsh
                </button>
              </form>
            </div>

            <table className={`${style.realTable}  table-bordered  `}>
              <thead>
                <tr>
                  <th className="totalFont" style={{ width: "60%" }}>
                    Role Name
                  </th>
                  <th className="totalFont" style={{ width: "20%" }}>
                    Edit
                  </th>
                  <th className="totalFont" style={{ width: "20%" }}>
                    Is Deleted
                  </th>
                </tr>
              </thead>
              <tbody>
                {allRoles.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      <i class="fa-regular fa-pen-to-square"></i>Edit
                    </td>
                    <td>{item.isDeleted ? "Yes" : "No"}</td>
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

        {/* /////////////////////////////////////// */}

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

              <h3 className="totalFont" style={{ marginBottom: "20px" }}>Add Role</h3>

              <form onSubmit={formik.handleSubmit}>
                <label className="totalFont" htmlFor="name">Role Name</label>
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
                    <p className="totalFont">Users:Create</p>
                    <p className="totalFont">Users:Update</p>
                    <p className="totalFont">Users:Delete</p>
                    <p className="totalFont">Roles:Read</p>
                    <p className="totalFont">Roles:Create</p>
                    <p className="totalFont">Roles:Update</p>
                    <p className="totalFont">Roles:Delete</p>
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
      </div>
    </>
  );
}
