import { useContext, useEffect, useState } from "react";
import style from "./ConfirmEmail.module.css";
import api from "../../api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [noEmail, setNoEmail] = useState(false);
  
  const [counter, setCounter] = useState(60);
  const [showResend, setShowResend] = useState(false);

  const [searchParams] = useSearchParams();
  const UserId = searchParams.get("UserId") ?? "";
  const Code = searchParams.get("Code") ?? "";

  // console.log("UserId =>", UserId);
  // console.log("Code =>", Code);
  // console.log(email);
  async function confirmEmail() {
    console.log("confirmEmail() started");
    if (!UserId || !Code) {
      console.log("Missing params → UserId or Code is empty");
      return;
    }
    try {
      const response = await api.post("/Auth/confirm-email", { UserId, Code });
      if (response.status === 200) {
        console.log("sucessful");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error exist:", error);
    }
  }
  const handleResend = async () => {
    if (!email) {
      alert(
        "Email address not found. Please login again to resend confirmation email."
      );
      return;
    }

    try {
      const response = await api.post("/Auth/resend-confirm-email", { email });
      if (response.status === 200) {
        setCounter(30);
        setShowResend(false);
        console.log("successful");
      } else {
        console.log("Failed to resend email. Please try again later.");
      }
    } catch (error) {
      console.error("Error exist:", error);
      toast.error(
        error.response?.data?.errors[1] ||
          "Something went wrong while resend confirmation",
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
  };

  useEffect(() => {
    
    if (UserId && Code) {
      const callConfirm = async () => {
        console.log("Calling confirmEmail...");
        await confirmEmail();
      };
      callConfirm();
    }
  }, [UserId, Code]); 

  useEffect(() => {
    if (counter === 0) {
      setShowResend(true);
      return;
    }
    const timer = setInterval(() => setCounter((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);
  useEffect(() => {
    if (!email) {
      setNoEmail(true);
    }
  }, []);

  return (
    <div className={`container-fluid p-0  ${style.checkemailpage} `}>
      <div
        className="px-4 shadow-lg py-2 d-flex flex-column"
        style={{
          marginTop :"120px" ,
          width: "100%",
          maxWidth: "470px",
          minHeight: "400px",
          maxHeight: "400px",
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
        <div className="p-5 text-center">
          
          <i className={`fa-regular fa-envelope-open ${style.locki}`}></i>
          <h2
            className="my-4 totalFont"
            style={{
              color: "white",
              fontSize: "2rem",
              background: "linear-gradient(to right, white, #bcbcbcff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
          >
            Check Your Email
          </h2>
          <p className="totalFont text-white-50" style={{ fontSize: "17px" }}>
            Please Check the email address {email} for instructions to confirm
            your email
          </p>

          <div className="mt-5">
            {noEmail ? (
              <p className="text-warning">
                Email address not found. Please Create Account to resend
                confirmation email.
              </p>
            ) : !showResend ? (
              <button disabled className="btn btn-secondary w-100 totalFont">
                Wait {counter}s
              </button>
            ) : (
              <button
                className="btn_deeb w-100 totalFont"
                onClick={handleResend}
              >
                Resend Check Email
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
