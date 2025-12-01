import React, { useEffect, useState } from 'react'
import style from './CheckEmail.module.css'
export default function CheckEmail() {
    const email=localStorage.getItem('email')
    const [showResend, setShowResend] = useState(false);
     const [counter, setCounter] = useState(60);

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
         className="px-4 shadow-lg py-2 d-flex flex-column"
         style={{
           marginTop: "120px",
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
             {!showResend ? (
               <button disabled className="btn btn-secondary w-100 totalFont">
                 Wait {counter}s
               </button>
             ) : (
               <button
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
