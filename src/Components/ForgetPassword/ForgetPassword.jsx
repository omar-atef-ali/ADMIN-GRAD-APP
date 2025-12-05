import React, { useState } from "react";
import style from "./ForgetPassword.module.css";
import { Link, useNavigate } from "react-router-dom";
import sideImage from "../../assets/images/ChatGPT Image Oct 6, 2025, 05_20_40 PM.png";
import { useFormik } from "formik";
import * as yup from "yup";
import api from "../../api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function ForgetPassword() {
  let [loading, setLoading] = useState(false);
  const naviagte = useNavigate();

  async function submit(values) {
    console.log(values);
    try {
      setLoading(true);
      const response = await api.post("/Auth/forget-password", values);
      // console.log(response);
      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: "We've sent you a link to reset your password. Please check your email.",
        background: "#0d1117",
        color: "#ffffff",
        confirmButtonColor: "rgba(0, 71, 171, 0.2)",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          confirmButton: "custom-btn",
          htmlContainer: "custom-text",
        },
      });
      // localStorage.setItem('email',values.email)
      naviagte("/check-email");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.errors[1] || "the selected email is invalid",
        {
          position: "top-center", // يظهر من اليمين
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

  let validationforget = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .min(5, "Email must be at least 5 characters long"),
  });

  let formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationforget,
    onSubmit: submit,
  });

  return (
    <>
      <div className={`container-fluid p-0 ${style.loginpage}`}>
        <div
          className="px-4 shadow-lg  py-5 d-flex flex-column"
          style={{
            marginTop: "120px",
            width: "100%",
            maxWidth: "470px",
            minHeight: "420px",
            maxHeight: "460px",
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
          {/* Back Link */}
          <div className="mb-3">
            <Link
              to="/"
              className={`${style.Free} totalFont d-inline-flex align-items-center text-decoration-none mb-3 small`}
              style={{
                color: "var(--accent)",
                fontSize: "0.85rem",
                gap: "4px",
              }}
            >
              <i
                className={` fa-solid fa-arrow-left`}
                style={{ fontSize: "12px", marginTop: "2px" }}
              ></i>
              Back to Login
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-3">
            <h2
              className="fw-bold totalFont"
              style={{
                color: "white",
                fontSize: "2.1rem",
                lineHeight: "1.2",
                background: "linear-gradient(to right, white, #bcbcbcff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.5rem",
              }}
            >
              Forgot Your Password
            </h2>
            <p
              className="text-white-50 totalFont"
              style={{ fontSize: "0.85rem", lineHeight: "1.4" }}
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                className="form-label totalFont"
                style={{ color: "white", fontSize: "0.95rem", fontWeight: 500 }}
              >
                Email address
              </label>{" "}
              <span className={`${style.reqStar}`}>*</span>
              <input
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="email"
                placeholder="example@gmail.com"
                className={`${style.custominput} totalFont form-control bg-transparent text-light py-2`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-danger small mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`${style.btn_deeb} w-100 mt-2 py-1 totalFont`}
              style={{ fontSize: "0.95rem", marginBottom: "5px" }}
              disabled={!(formik.isValid && formik.dirty) || loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                />
              ) : (
                "send"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
