import React from "react";
import style from "./Roles.module.css";

export default function Roles() {
  return (
    <>
      <div className={` container-fluid ${style.rolesPage}`}>
        <div className=" d-flex justify-content-between">
          <h2 className={`${style.rolesH} totalFont`}>Roles</h2>
          <button className={`${style.RoleButton} totalFont  col-12 col-md-2`}>
            <i class="fa-solid fa-circle-plus"></i> Add Role
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
                  className={`${style.UserButton} totalFont  col-12 col-md-1`}
                >
                  Searsh
                </button>
              </form>
            </div>

            <table className={`${style.realTable}  table-bordered  `}>
              <thead>
                <tr className="sticky-top">
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
                <tr>
                  <td>Admin</td>
                  <td>
                    <i class="fa-regular fa-pen-to-square"></i>Edit
                  </td>
                  <td><i class="fa-solid fa-lock"></i> <i class="fa-solid fa-lock-open"></i></td>
                </tr>
                <tr>
                  <td>Manager</td>
                  <td>
                    <i class="fa-regular fa-pen-to-square"></i>Edit
                  </td>
                  <td><i class="fa-solid fa-lock"></i> <i class="fa-solid fa-lock-open"></i></td>
                </tr>
                <tr>
                  <td>Editor</td>
                  <td>
                    <i class="fa-regular fa-pen-to-square"></i>Edit
                  </td>
                  <td><i class="fa-solid fa-lock"></i> <i class="fa-solid fa-lock-open"></i></td>
                </tr>
                <tr>
                  <td>Viewer</td>
                  <td>
                    <i class="fa-regular fa-pen-to-square"></i>Edit
                  </td>
                  <td><i class="fa-solid fa-lock"></i> <i class="fa-solid fa-lock-open"></i></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
