import { useContext, useEffect, useState } from "react";
import style from "./ResetPassword.module.css";
import api from "../../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let [showNewPassword, setShowNewPassword] = useState(false);
  let [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  let [isSaving, setIsSaving] = useState(false);
  const code = searchParams.get("Code") ?? "";
  const email = searchParams.get("email") ?? "";

  // console.log("Code =>", Code);
  // console.log(email);

  async function SubmitPassword(values) {
    // const { confirmNewPassword, ...dataToSend } = values;
    const body = {
      // email: localStorage.getItem('email'),
      email,
      code,
      newPassword:values.newPassword

    }
    console.log("reset password started");
    if (!code) {
      console.log("Missing params → Code is empty");
      return;
    }

    try {
      setIsSaving(true)
      const response = await api.post("/Auth/reset-password",  body );
      if (response.status === 200) {
        console.log("sucessful");
        navigate("/");
      }
    } catch (error) {
       toast.error(
        error.response?.data?.errors[1] ||
          "Something went wrong while reset password",
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
      )
    }
    finally {
      setIsSaving(false);
    }
  }

  let validationResetPass = yup.object({
    newPassword: yup
      .string()
      .required("required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      ),
    confirmNewPassword: yup
      .string()
      .required("required")
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  });
  let formik2 = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: SubmitPassword,
    validationSchema: validationResetPass,
  });


  return (
    <div className={`${style.Resetpasspage}`}>
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex align-items-center justify-content-center">
            <div
              className="card shadow mb-5 p-4 py-5 "
              style={{
                marginTop: "120px",
                width: "100%",
                maxWidth: "470px",
                minHeight: "450px",
                maxHeight: "890px",
                overflow: "hidden",
                background: `
                               radial-gradient(
                                 circle at 2% 50%,       
                                 rgba(5, 53, 121, 0.6) 0%,  
                                 rgba(0, 71, 171, 0.2) 20%, 
                                 rgba(0, 0, 0, 0.9) 70%,    
                                 rgba(0, 0, 0, 1) 100%      
                               )
                             `,
                backdropFilter: "blur(15px)",
                borderRadius: "28px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 0 50px rgba(0, 0, 0, 0.7)",
              }}
            >
              <h5
                className={`fw-semibold mb-3 text-center  totalFont`}
                style={{
                  fontSize: "2.2rem",
                  lineHeight: "1.2",
                  background: "linear-gradient(to right, white, #bcbcbcff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  paddingBottom: "20px",
                }}
              >
                Reset Password
              </h5>
              <form onSubmit={formik2.handleSubmit}>
                <div className="mb-3">
                  <label
                    htmlFor="newPassword"
                    className={`form-label fw-medium text-white  totalFont`}
                    style={{ fontSize: "0.95rem", fontWeight: "500" }}
                  >
                    New Password
                  </label>{" "}
                  <span className={`${style.reqStar}`}>*</span>
                  <div className="position-relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      placeholder="New password"
                      className={`${style.custominput}  totalFont form-control pe-5 bg-transparent text-light`}
                      onBlur={formik2.handleBlur}
                      onChange={formik2.handleChange}
                      value={formik2.values.newPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 shadow-none"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {showNewPassword ? (
                        <i className="fa-solid fa-eye-slash"></i>
                      ) : (
                        <i className="fa-solid fa-eye"></i>
                      )}
                    </button>
                  </div>
                  {formik2.touched.newPassword &&
                    formik2.errors.newPassword && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {formik2.errors.newPassword !=="required" ? formik2.errors.newPassword  :""}
                      </div>
                    )}
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="confirmNewPassword"
                    className={`form-label fw-medium text-white  totalFont`}
                    style={{ fontSize: "0.95rem", fontWeight: "500" }}
                  >
                    Confirm New Password
                  </label>{" "}
                  <span className={`${style.reqStar}`}>*</span>
                  <div className="position-relative">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      placeholder="Confirm new password"
                      className={`${style.custominput}  totalFont form-control pe-5 bg-transparent text-light`}
                      onBlur={formik2.handleBlur}
                      onChange={formik2.handleChange}
                      value={formik2.values.confirmNewPassword}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 shadow-none"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {showConfirmNewPassword ? (
                        <i className="fa-solid fa-eye-slash"></i>
                      ) : (
                        <i className="fa-solid fa-eye"></i>
                      )}
                    </button>
                    
                  </div>
                  {formik2.touched.confirmNewPassword &&
                      formik2.errors.confirmNewPassword && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {formik2.errors.confirmNewPassword!=="required"?formik2.errors.confirmNewPassword :""}
                        </div>
                      )}
                </div>



                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className={`${style.btn_deeb} px-4 py-2`}
                    disabled={!(formik2.isValid && formik2.dirty) || isSaving}
                  >
                    {isSaving ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
