import React from "react";
import style from "./Roles.module.css";

export default function Roles() {
  return (
    <>
      <div className={` container-fluid ${style.rolesPage}`}>
        <div className=" d-flex justify-content-between">
          <h2 className={`${style.rolesH} totalFont`}>Roles</h2>
          <button className="btn btn-info totalFont">Add Role</button>
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
                  className="btn btn-outline-success totalFont"
                  type="submit"
                >
                  Search
                </button>
              </form>
            </div>

            <table
              className={`${style.realTable}  table-bordered  `}
            >
              <thead >
                <tr className="sticky-top">
                  <th style={{ width: "20%" }}>Role Name</th>
                  <th style={{ width: "40%" }}>Permissions</th>
                  <th style={{ width: "40%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <div className={`${style.permissionsDiv}`}>read</div>
                    <div className={`${style.permissionsDiv}`}>manage</div>
                  </td>
                  <td>Smith</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    <div className={`${style.permissionsDiv}`}>read</div>
                    <div className={`${style.permissionsDiv}`}>read</div>
                  </td>
                  <td>Smith</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    <div className={`${style.permissionsDiv}`}>read</div>
                    <div className={`${style.permissionsDiv}`}>read</div>
                  </td>
                  <td>Smith</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    <div className={`${style.permissionsDiv}`}>read</div>
                    <div className={`${style.permissionsDiv}`}>read</div>
                  </td>
                  <td>Smith</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
