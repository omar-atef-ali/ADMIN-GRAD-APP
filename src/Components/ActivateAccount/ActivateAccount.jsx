
import style from './ActivateAccount.module.css'
import { useState } from "react";
import api from "../../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from 'formik';

export default function ActivateAccount() {
    let [showPassword, setShowPassword] = useState(false);
    let [showConfirmPassword, setShowConfirmPassword] = useState(false);
    let [isSaving, setIsSaving] = useState(false);
    const navigate=useNavigate()

    const [searchParams] = useSearchParams();
    const UserId = searchParams.get("UserId") ?? "";
    const Code = searchParams.get("Code") ?? "";
    async function SubmitPassword(values) {
        const { confirmPassword, ...dataToSend } = values;
        const body = {
           UserId,
            Code,
            dataToSend

        }
        console.log("Activate");
        if (!Code) {
            console.log("Missing params →UserId && Code is empty");
            return;
        }

        try {
            setIsSaving(true)
            const response = await api.post("/Auth/activate-account", { body });
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
        console.log(dataToSend)
    }
    let validationActivation = yup.object({
        password: yup
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
        confirmPassword: yup
            .string()
            .required("required")
            .oneOf([yup.ref("password"), null], "Passwords must match"),
    });
    let formik2 = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        onSubmit: SubmitPassword,
        validationSchema: validationActivation,
    });


    return (
        <div className={`${style.ActivateAccountpage}`}>
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
                            <div className="text-center mb-4">
                                <h5
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
                                    Activate Account
                                </h5>
                                <p
                                    className="text-white-50 totalFont"
                                    style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}
                                >
                                    Activate your account so you can login
                                </p>
                            </div>

                            <form onSubmit={formik2.handleSubmit}>
                                <div className="mb-3">
                                    <label
                                        htmlFor="password"
                                        className={`form-label fw-medium text-white  totalFont`}
                                        style={{ fontSize: "0.95rem", fontWeight: "500" }}
                                    >
                                        Password
                                    </label>{" "}
                                    <span className={`${style.reqStar}`}>*</span>
                                    <div className="position-relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            placeholder="password"
                                            className={`${style.custominput}  totalFont form-control pe-5 bg-transparent text-light`}
                                            onBlur={formik2.handleBlur}
                                            onChange={formik2.handleChange}
                                            value={formik2.values.password}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 shadow-none"
                                            style={{ color: "var(--muted-foreground)" }}
                                        >
                                            {showPassword ? (
                                                <i className="fa-solid fa-eye-slash"></i>
                                            ) : (
                                                <i className="fa-solid fa-eye"></i>
                                            )}
                                        </button>
                                    </div>
                                    {formik2.touched.password &&
                                        formik2.errors.password && (
                                            <div
                                                className="text-danger mt-1"
                                                style={{ fontSize: "0.8rem" }}
                                            >
                                                {formik2.errors.password !== "required" ? formik2.errors.password : ""}
                                            </div>
                                        )}
                                </div>

                                <div className="mb-3">
                                    <label
                                        htmlFor="confirmPassword"
                                        className={`form-label fw-medium text-white  totalFont`}
                                        style={{ fontSize: "0.95rem", fontWeight: "500" }}
                                    >
                                        Confirm Password
                                    </label>{" "}
                                    <span className={`${style.reqStar}`}>*</span>
                                    <div className="position-relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            placeholder="Confirm password"
                                            className={`${style.custominput}  totalFont form-control pe-5 bg-transparent text-light`}
                                            onBlur={formik2.handleBlur}
                                            onChange={formik2.handleChange}
                                            value={formik2.values.confirmPassword}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 shadow-none"
                                            style={{ color: "var(--muted-foreground)" }}
                                        >
                                            {showConfirmPassword ? (
                                                <i className="fa-solid fa-eye-slash"></i>
                                            ) : (
                                                <i className="fa-solid fa-eye"></i>
                                            )}
                                        </button>

                                    </div>
                                    {formik2.touched.confirmPassword &&
                                        formik2.errors.confirmPassword && (
                                            <div
                                                className="text-danger mt-1"
                                                style={{ fontSize: "0.8rem" }}
                                            >
                                                {formik2.errors.confirmPassword !== "required" ? formik2.errors.confirmPassword : ""}
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
                                            "Send"
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
