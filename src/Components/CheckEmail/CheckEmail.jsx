import React, { useEffect, useState } from 'react'
import style from './CheckEmail.module.css'
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import api from '../../api';
export default function CheckEmail() {
    const email=localStorage.getItem('email')
    const [showResend, setShowResend] = useState(false);
     const [counter, setCounter] = useState(60);


     console.log(email.trim())

      


    async function resendEmail() {
    try {
      const response = await api.post("/Auth/forget-password", {email});
      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: "We've sent you a link to reset your password. Please check your inbox.",
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
      console.log("recieved")

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.errors[1] ||"the selected email is invalid", {
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

     useEffect(() => {
        if (counter === 0) {
          setShowResend(true);
          return;
        }
        const timer = setInterval(() => setCounter((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
      }, [counter]);
  return (
     <div className={`container-fluid p-0  ${style.checkemailpage} `}>
       <div
         className={`px-4 shadow-lg py-2 d-flex flex-column ${style.checkemailCard}`}
        //  style={{
        //    marginTop: "120px",
        //    width: "100%",
        //    maxWidth: "470px",
        //    minHeight: "400px",
        //    maxHeight: "400px",
        //    overflow: "hidden",
        //    background: `
        //          radial-gradient(
        //            circle at 2% 50%,       
        //            rgba(5, 53, 121, 0.6) 0%,  
        //            rgba(0, 71, 171, 0.2) 20%, 
        //            rgba(0, 0, 0, 0.9) 70%,   
        //            rgba(13, 13, 13, 1) 100%        
        //          )
        //        `,
        //    backdropFilter: "blur(15px)",
        //    borderRadius: "28px",
        //    border: "1px solid rgba(255, 255, 255, 0.08)",
        //    boxShadow: "0 0 50px rgba(0, 0, 0, 0.7)",
        //  }}
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
             {!showResend ? (
               <button disabled className="btn btn-secondary w-100 totalFont">
                 Wait {counter}s
               </button>
             ) : (
               <button
                  onClick={resendEmail}
                 className="btn_deeb w-100 totalFont"
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
