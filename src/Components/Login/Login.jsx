

import React, { useContext, useState } from "react";
import style from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import api from "../../api";
import toast from "react-hot-toast";
import { userContext } from "../../context/userContext";
import * as yup from "yup";

export default function Login() {
  let navigate = useNavigate();

  let [loading, setLoading] = useState(false);
  let { setUserToken } = useContext(userContext);
  let [showPassword, setShowPassword] = useState(false);

  async function submit(values) {
    try {
      setLoading(true);
      const { data } = await api.post("/Auth", values);
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUserToken(data.token);
      navigate("/main");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Login Error:", error);
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
    }
  }

  let validationLogin = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .min(5, "Email must be at least 5 characters long"),

    password: yup
      .string()
      .min(4, "Password must be at least 4 characters long"),
  });

  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationLogin,
    onSubmit: submit,
  });

  return (
    <>
      <div className={`container-fluid p-0  ${style.loginpage}`}>
        <div
          className="px-4 shadow-lg d-flex flex-column py-5"
          style={{
            marginTop :"120px",
            width: "100%",
            maxWidth: "470px",
            minHeight: "450px",
            maxHeight: "520px",
            overflow: "hidden",
            background: `
        radial-gradient(
          circle at 2% 50%,       
          rgba(5, 53, 121, 0.6) 0%,  
          rgba(0, 71, 171, 0.2) 20%, 
          rgba(0, 0, 0, 0.9) 70%,   
          rgba(13, 13, 13, 1) 100%        
        )
      `,
            backdropFilter: "blur(15px)",
            borderRadius: "28px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 0 50px rgba(0, 0, 0, 0.7)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <h2
              className="fw-bold totalFont"
              style={{
                color: "white",
                fontSize: "2.25rem",
                lineHeight: "1.2",
                background: "linear-gradient(to right, white, #bcbcbcff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Back
            </h2>
            <p
              className="text-white-50 totalFont"
              style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}
            >
              Please sign in to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div className="mb-4 position-relative">
              <label
                className="form-label totalFont"
                style={{ color: "white", fontSize: "0.95rem", fontWeight: 500 }}
              >
                Email 
              </label> <span className={`${style.reqStar1}`}>*</span>
              <input
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="email"
                placeholder="example@gmail.com"
                className={`totalFont ${style.custominput} form-control bg-transparent text-light py-1`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-danger small mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="d-flex justify-content-between position-relative align-items-center mb-2">
                <label
                  htmlFor="password"
                  className="form-label mb-0 totalFont"
                  style={{
                    color: "white",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                >
                  Password 
                </label> <span className={`${style.reqStar2}`}>*</span>
                <Link
                  to={"/forget-password"}
                  className={`text-decoration-none totalFont ${style.Free}`}
                  style={{ color: "#dcdcdc", fontSize: "0.85rem" }}
                >
                  Forget password?
                </Link>
              </div>

              <div className="position-relative">
                <input
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type={showPassword ? "text" : "password"}
                  className={`totalFont ${style.custominput} form-control pe-5 bg-transparent text-light py-2`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 shadow-none"
                  style={{ color: "#aaa", fontSize: "0.9rem" }}
                >
                  {showPassword ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </button>
              </div>

              {formik.touched.password && formik.errors.password && (
                <div className="text-danger small mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`${style.btn_deeb} w-100 mt-2 py-1 totalFont`}
              style={{ fontSize: "0.95rem", marginBottom: "5px" }}
              disabled={!(formik.isValid && formik.dirty) || loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm text-light"role="status"/>
              ) : (
                "login"
              )}
            </button>
            

            {/* Signup link */}
            <p
              className="mt-3 text-center totalFont"
              style={{ fontSize: "0.875rem", color: "#dcdcdc" }}
            >
              Don't have an account?
              <Link
                className={`ms-1 totalFont ${style.Free}`}
                to={"/register"}
                style={{ color: "white" }}
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

