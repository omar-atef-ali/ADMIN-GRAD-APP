
import React, { useContext, useEffect, useState } from 'react'
import style from "./Settings.module.css"
import { useFormik } from "formik";
import * as yup from "yup";
import api from "../../api";
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { userContext } from '../../context/userContext';
import { useSearchParams } from 'react-router-dom';
export default function Settings() {
  const { userToken } = useContext(userContext)
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [userSessions, setuserSessions] = useState([])
  const [searchParams] = useSearchParams()

  const UserId = searchParams.get('UserId') ?? ""
  const Code = searchParams.get('Code') ?? ""
  console.log("UserId =>", UserId);
  console.log("Code =>", Code);



  async function handleChangePassword(values) {
    const { confirmNewPassword, ...dataToSend } = values;
    try {
      setIsLoading(true)
      let response = await api.put(`/Accounts/change-password`, dataToSend,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      //   console.log(response.data);
      // console.log("sucessful");
      Swal.fire({
        icon: "success",
        title: "Password changed!",
        text: "Your password has been updated successfully.",
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


    } catch (error) {
      //   console.log(error);
      toast.error(
        error.response?.data?.message ||
        "Something went wrong while changing your password.",
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
    } finally {
      setIsLoading(false);
    }
  }

  async function getUserSessions() {
    try {

      let response = await api.get(`/UserSessions`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      console.log(response.data)
      setuserSessions(response.data)
    }
    catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.errors[1])
    }
  }

  async function trustDevice(sessionId) {
    try {
      let response = await api.put(`/UserSessions/${sessionId}/trust`, {}, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      })
      console.log(response)
      toast.success(response.data.message)

    }
    catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.errors[1])
    }
  }

  async function putTrustedDevice() {
    try {
      let response = await api.put(`/UserSessions/verify-trust?UserId=${UserId}&Code=${encodeURIComponent(Code)}`, {}, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      })
      await getUserSessions();
      console.log(response)
      toast.success(response.data.message)
    }
    catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Something went wrong"
      )
    }
  }



  function getDeviceIcon(type) {
    switch (type) {
      case 1:
        return <i className="fa-solid fa-desktop"></i>;
      case 2:
        return <i className="fa-solid fa-mobile-screen-button"></i>;
      case 3:
        return <i className="fa-solid fa-tablet-screen-button"></i>;
      default:
        return <i className="fa-solid fa-question"></i>;
    }
  }


  async function deleteUsers() {
    try {
      let response = await api.delete(`/UserSessions/others`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
      console.log(response)
      await getUserSessions();
      toast.success("All Sessions removed");
    }
    catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.errors[1] || "Failed to remove sessions")
    }
  }

  async function deleteUserSession(id) {
    try {
      let response = await api.delete(`/UserSessions/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
      console.log(response)
      setuserSessions(prev => prev.filter(s => s.id !== id))
      toast.success("Session removed");
    }
    catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.errors[1] || "Failed to remove session")
    }
  }



  function formatDate(isoDate) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const d = new Date(isoDate);
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  }


  function timeAgo(dateString) {
    const past = new Date(dateString);
    const now = new Date();

    const diff = Math.floor((now - past) / 1000); // فرق بالثواني

    if (diff < 60) return "Active"; // أقل من دقيقة → Active
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  }


  let validationChangePass = yup.object({
    currentPassword: yup
      .string()
      .required(""),
    newPassword: yup
      .string()
      .required("")
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
      .required("")
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  });
  let formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: handleChangePassword,
    validationSchema: validationChangePass,
  });

  useEffect(() => {
    getUserSessions()
  }, [])
  // useEffect(() => {
  //   if (UserId && Code && !verified) {
  //     putTrustedDevice();
  //     setVerified(true);
  //   }
  // }, [UserId, Code, verified]);

  //   useEffect(() => {
  //   if (UserId && Code && !verified) {
  //     setVerified(true);       
  //     putTrustedDevice();      
  //   }
  // }, [UserId, Code]);
  useEffect(() => {
    if (UserId && Code && !verified && userToken) {  // ← اضيف userToken هنا
      setVerified(true);
      putTrustedDevice();
    }
  }, [UserId, Code, userToken]);  // ← اضيف userToken في الـ dependencies






  let { loading } = useContext(userContext);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    position: '',
    phoneNumber: '',
    businessAddress: ''
  })
  const [isDisabled, setIsDisabled] = useState(true)
  const [save, setSave] = useState(false)

  useEffect(() => {
    if (loading || !userToken) return;

    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/Accounts", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        // Ensure we don't set null values for controlled inputs
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          companyName: data.companyName || '',
          email: data.email || '',
          position: data.position || '',
          phoneNumber: data.phoneNumber || '',
          businessAddress: data.businessAddress || ''
        })
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error(
          "Something went wrong",
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
          },
        );
      }
    };

    fetchProfile();
  }, [userToken, loading]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = async () => {
    if (save) {
      // Logic to save data
      try {
        const formData = new FormData();
        for (const key in userData) {
          formData.append(key, userData[key]);
        }

        await api.put("/Users/profile", formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        toast.success("Profile updated successfully!");
        setSave(false);
        setIsDisabled(true);
        refreshSidebar(); // Update parent layout
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error(
          "Failed to update profile.",
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
          },
        );
      }
    } else {
      // Enable edit mode
      setIsDisabled(false);
      setSave(true);
    }
  };


  const handleCancel = () => {
    setIsDisabled(true);
    setSave(false);
    fetchProfile();
  }


  /* ------------------------------- Notification Logic ------------------------------ */
  const [initialNotificationsInfo, setInitialNotificationsInfo] = useState({
    productsUpdatesNotification: false,
    billingNotification: false
  });
  const [productsNotification, setProductsNotification] = useState(false);
  const [billingNotification, setBillingNotification] = useState(false);

  const [productsLoading, setProductsLoading] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);


  // Fetch initial notifications
  useEffect(() => {
    if (!userToken) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/Users/profile/notifications", {
          headers: { Authorization: `Bearer ${userToken}` }
        });

        const initial = {
          productsUpdatesNotification: data.productsUpdatesNotification,
          billingNotification: data.billingNotification
        };

        setInitialNotificationsInfo(initial);
        setProductsNotification(initial.productsUpdatesNotification);
        setBillingNotification(initial.billingNotification);

      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.errors[1] ||
          "Something went wrong",
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
          },
        );

      }
    };

    fetchNotifications();
  }, [userToken]);

  // Debounced API call if state changed
  // Products Notification Effect
  useEffect(() => {
    const productChanged = productsNotification !== initialNotificationsInfo.productsUpdatesNotification;

    if (!productChanged) return;

    const timerId = setTimeout(async () => {
      try {
        setProductsLoading(true)
        await api.put("/Users/profile/toggle-products-updates-notification", {}, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        // console.log("ok Products");

        // Update initial state for product only
        setInitialNotificationsInfo(prev => ({
          ...prev,
          productsUpdatesNotification: productsNotification
        }));
        setProductsLoading(false)

      } catch (error) {
        console.error("Error updating products notification:", error);
        toast.error(
          error.response?.data?.errors[1] || "Something went wrong",
          {
            position: "top-center",
            duration: 4000,
            style: {
              background: "linear-gradient(to right, rgba(121, 5, 5, 0.9), rgba(171, 0, 0, 0.85))",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "16px 20px",
              color: "#ffffff",
              fontSize: "0.95rem",
              borderRadius: "5px",
              width: "300px",
              height: "60px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
            },
            iconTheme: { primary: "#FF4D4F", secondary: "#ffffff" },
          },
        );
        setProductsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [productsNotification, initialNotificationsInfo.productsUpdatesNotification, userToken]);


  // Billing Notification Effect
  useEffect(() => {
    const billingChanged = billingNotification !== initialNotificationsInfo.billingNotification;

    if (!billingChanged) return;

    const timerId = setTimeout(async () => {
      try {
        setBillingLoading(true)
        await api.put("/Users/profile/toggle-billing-notification", {}, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        // console.log("ok billing");

        // Update initial state for billing only
        setInitialNotificationsInfo(prev => ({
          ...prev,
          billingNotification: billingNotification
        }));
        setBillingLoading(false)

      } catch (error) {
        console.error("Error updating billing notification:", error);
        toast.error(
          error.response?.data?.errors[1] || "Something went wrong",
          {
            position: "top-center",
            duration: 4000,
            style: {
              background: "linear-gradient(to right, rgba(121, 5, 5, 0.9), rgba(171, 0, 0, 0.85))",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "16px 20px",
              color: "#ffffff",
              fontSize: "0.95rem",
              borderRadius: "5px",
              width: "300px",
              height: "60px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
            },
            iconTheme: { primary: "#FF4D4F", secondary: "#ffffff" },
          },
        );
        setBillingLoading(false);
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [billingNotification, initialNotificationsInfo.billingNotification, userToken]);





  return <>


    <main className={`${style.content_area}`}>
      <h3 className={`${style.main_title}`}>Settings</h3>
      <p className={`${style.main_p}`}>Manage your account settings and preferences</p>


      <div className={style.FormSection}>
        <div className={style.SectionHeader}>
          <h3 className={style.SectionTitle}>Personal Information</h3>

        </div>

        <div className={style.FormGrid}>
          {/* <!-- First Name --> */}
          <div className={style.InputGroup}>
            <label className={style.InputLabel}>First Name</label>
            <div className={style.InputWrapper}>
              <div className={style.InputIcon}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M14.25 15.75V14.25C14.25 13.4544 13.9339 12.6913 13.3713 12.1287C12.8087 11.5661 12.0456 11.25 11.25 11.25H6.75C5.95435 11.25 5.19129 11.5661 4.62868 12.1287C4.06607 12.6913 3.75 13.4544 3.75 14.25V15.75"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M9 8.25C10.6569 8.25 12 6.90685 12 5.25C12 3.59315 10.6569 2.25 9 2.25C7.34315 2.25 6 3.59315 6 5.25C6 6.90685 7.34315 8.25 9 8.25Z"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="firstName"
                className={style.FormInput}
                placeholder="First Name"
                value={userData.firstName}
                onChange={handleInputChange}
                disabled={isDisabled}
                style={isDisabled ? { opacity: .5 } : { opacity: 1 }}
              />
            </div>
          </div>

          {/* <!-- Last Name --> */}
          <div className={style.InputGroup}>
            <label className={style.InputLabel}>Last Name</label>
            <div className={style.InputWrapper}>
              <div className={style.InputIcon}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M14.25 15.75V14.25C14.25 13.4544 13.9339 12.6913 13.3713 12.1287C12.8087 11.5661 12.0456 11.25 11.25 11.25H6.75C5.95435 11.25 5.19129 11.5661 4.62868 12.1287C4.06607 12.6913 3.75 13.4544 3.75 14.25V15.75"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M9 8.25C10.6569 8.25 12 6.90685 12 5.25C12 3.59315 10.6569 2.25 9 2.25C7.34315 2.25 6 3.59315 6 5.25C6 6.90685 7.34315 8.25 9 8.25Z"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="lastName"
                className={style.FormInput}
                placeholder="Last Name"
                value={userData.lastName}
                onChange={handleInputChange}
                disabled={isDisabled}
                style={isDisabled ? { opacity: .5 } : { opacity: 1 }}

              />
            </div>
          </div>

          {/* <!-- Company Name --> */}
          <div className={style.InputGroup}>
            <label className={style.InputLabel}>Company Name</label>
            <div className={style.InputWrapper}>
              <div className={style.InputIcon}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 7.5H9.0075"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M9 10.5H9.0075"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M9 4.5H9.0075"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 7.5H12.0075"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 10.5H12.0075"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 4.5H12.0075"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6 7.5H6.0075"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6 10.5H6.0075"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6 4.5H6.0075"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6.75 16.5V14.25C6.75 14.0511 6.82902 13.8603 6.96967 13.7197C7.11032 13.579 7.30109 13.5 7.5 13.5H10.5C10.6989 13.5 10.8897 13.579 11.0303 13.7197C11.171 13.8603 11.25 14.0511 11.25 14.25V16.5"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M13.5 1.5H4.5C3.67157 1.5 3 2.17157 3 3V15C3 15.8284 3.67157 16.5 4.5 16.5H13.5C14.3284 16.5 15 15.8284 15 15V3C15 2.17157 14.3284 1.5 13.5 1.5Z"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="companyName"
                className={style.FormInput}
                placeholder="Company Name"
                value={userData.companyName}
                onChange={handleInputChange}
                disabled={isDisabled}
                style={isDisabled ? { opacity: .5 } : { opacity: 1 }}
              />
            </div>
          </div>

          {/* <!-- Email Address --> */}
          <div className={style.InputGroup}>
            <label className={style.InputLabel}>Email Address</label>
            <div className={style.InputWrapper}>
              <div className={style.InputIcon}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M16.5 5.25L9.75675 9.54525C9.52792 9.67816 9.268 9.74817 9.00338 9.74817C8.73875 9.74817 8.47883 9.67816 8.25 9.54525L1.5 5.25"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M15 3H3C2.17157 3 1.5 3.67157 1.5 4.5V13.5C1.5 14.3284 2.17157 15 3 15H15C15.8284 15 16.5 14.3284 16.5 13.5V4.5C16.5 3.67157 15.8284 3 15 3Z"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                className={style.FormInput}
                placeholder="email@company.com"
                value={userData.email}
                onChange={handleInputChange}
                disabled={isDisabled}
                style={isDisabled ? { opacity: .5 } : { opacity: 1 }}

              />
            </div>
          </div>

          {/* <!-- Position --> */}
          <div className={style.InputGroup}>
            <label className={style.InputLabel}>Position</label>
            <div className={style.InputWrapper}>
              <div className={style.InputIcon}>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path
                    d="M16 2.00065V12.0007H0V2.00065H5V1.00065C5 0.860026 5.02604 0.729818 5.07812 0.610026C5.13021 0.490234 5.20052 0.386068 5.28906 0.297526C5.3776 0.208984 5.48438 0.136068 5.60938 0.078776C5.73438 0.0214844 5.86458 -0.00455729 6 0.000651042H10C10.1406 0.000651042 10.2708 0.0266927 10.3906 0.078776C10.5104 0.130859 10.6146 0.201172 10.7031 0.289714C10.7917 0.378255 10.8646 0.485026 10.9219 0.610026C10.9792 0.735026 11.0052 0.865234 11 1.00065V2.00065H16ZM6 2.00065H10V1.00065H6V2.00065ZM1 3.00065V4.44596L6 6.93815V6.00065H10V6.93815L15 4.44596V3.00065H1ZM7 7.00065V8.00065H9V7.00065H7ZM15 11.0007V5.55534L10 8.06315V9.00065H6V8.06315L1 5.55534V11.0007H15Z"
                    fill="#717182"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="position"
                className={style.FormInput}
                placeholder="Position"
                value={userData.position}
                onChange={handleInputChange}
                disabled={isDisabled}
                style={isDisabled ? { opacity: .5 } : { opacity: 1 }}

              />
            </div>
          </div>

          {/* <!-- Phone (Custom added for balance) --> */}
          <div className={style.InputGroup}>
            <label className={style.InputLabel}>Phone Number</label>
            <div className={style.InputWrapper}>
              <div className={style.InputIcon}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#717182"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <input
                type="tel"
                name="phoneNumber"
                className={style.FormInput}
                placeholder="+20xxxxxxxxxx"
                value={userData.phoneNumber}
                onChange={handleInputChange}
                disabled={isDisabled}
                style={isDisabled ? { opacity: .5 } : { opacity: 1 }}

              />
            </div>
          </div>

          {/* <!-- Business Address (Full Width) --> */}
          <div className={`${style.InputGroup} ${style.ColSpan2}`}>
            <label className={style.InputLabel}>Business Address</label>
            <div className={style.InputWrapper}>
              <div className={style.InputIcon}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 10C10.6569 10 12 8.65685 12 7C12 5.34315 10.6569 4 9 4C7.34315 4 6 5.34315 6 7C6 8.65685 7.34315 10 9 10Z"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M15 7.5C15 11.2448 10.8457 15.1447 9.45075 16.3492C9.32079 16.447 9.1626 16.4998 9 16.4998C8.8374 16.4998 8.67921 16.447 8.54925 16.3492C7.15425 15.1447 3 11.2448 3 7.5C3 5.9087 3.63214 4.38258 4.75736 3.25736C5.88258 2.13214 7.4087 1.5 9 1.5C10.5913 1.5 12.1174 2.13214 13.2426 3.25736C14.3679 4.38258 15 5.9087 15 7.5Z"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="businessAddress"
                className={style.FormInput}
                placeholder="Address"
                value={userData.businessAddress}
                onChange={handleInputChange}
                disabled={isDisabled}
                style={isDisabled ? { opacity: .5 } : { opacity: 1 }}
              />
            </div>
          </div>
        </div>
      </div>

      <section className={`${style.security_section}`}>
        <h2 className={`${style.section_title}`}>Change Password</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className={`${style.form_group}`}>
            <label className={`${style.form_label}`}>Current Password</label>
            <div className={`${style.input_wrapper}`}>
              <span className={`${style.input_icon}`} >
                <i className="fa-solid fa-lock"></i>
              </span>
              <input id="currentPassword"
                name="currentPassword"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.currentPassword}
                className={`${style.form_input}`} type="password" placeholder="Enter your password" />

            </div>
            <div className={`${style.error_placeholder}`}>
              {formik.touched.currentPassword && formik.errors.currentPassword && (
                <div
                  className="text-danger mt-1"
                  style={{ fontSize: "0.8rem" }}
                >
                  {formik.errors.currentPassword}
                </div>
              )}
            </div>
          </div>
          <div className={`${style.form_group}`}>
            <label className={`${style.form_label}`}>New Password</label>
            <div className={`${style.input_wrapper}`}>
              <input
                id="newPassword"
                name="newPassword"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.newPassword}

                className={`${style.form_input}`} type="password" placeholder="Enter your new password" />
              <span className={`${style.input_icon}`}>
                <i className="fa-solid fa-lock"></i>
              </span>
            </div>
            <div className={`${style.error_placeholder}`}>
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div
                  className="text-danger mt-1"
                  style={{ fontSize: "0.8rem" }}
                >
                  {formik.errors.newPassword}
                </div>
              )}
            </div>
            <p className={`${style.password_hint} password-hint`}>Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character (e.g. !@#$%^&*)</p>
          </div>
          <div className={`${style.form_group}`}>
            <label className={`${style.form_label}`}>Confirm New Password</label>
            <div className={`${style.input_wrapper}`}>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.confirmNewPassword}
                className={`${style.form_input}`} type="password" placeholder="Confirm your new password" />
              <span className={`${style.input_icon}`}>
                <i className="fa-solid fa-lock"></i>
              </span>
            </div>
            <div className={`${style.error_placeholder}`}>
              {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword && (
                <div
                  className="text-danger mt-1"
                  style={{ fontSize: "0.8rem" }}
                >
                  {formik.errors.confirmNewPassword}
                </div>
              )}
            </div>
          </div>
          <div className={style.parent_update_btn}>
            <button
              type="submit"
              className={`${style.update_password_btn}`}
              disabled={!(formik.isValid && formik.dirty) || isLoading}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm text-light" role="status" />
              ) : (
                "Update Password"
              )}
            </button>
          </div>


        </form>
      </section>


      <section className={`${style.sessions_section}`}>
        <h2 className={`${style.section_title}`}>Active Sessions</h2>




        {userSessions.map((users) => (
          <div key={users.id} className={`${style.device_card}`}>
            <div className={`${style.card_header}`}>
              <div className={`${style.info}`}>

                <div className={`${style.info_parent}`}>
                  <div className={`${style.info_sipling}`}>
                    <div>
                      {getDeviceIcon(users.deviceType)}
                    </div>
                    <div className={`${style.title}`}>{users.os} - {users.browser}</div>
                  </div>
                  <div>
                    {
                      users.isCurrent ? <button className={`${style.current_btn}`}>Current</button>
                        : <button onClick={() => deleteUserSession(users.id)} className={`${style.no_current_btn}`}>Sign Out</button>

                    }
                  </div>
                </div>


                <div className={`${style.location}`}>
                  <div className={`${style.location_parent}`}>
                    <i className={`fa-solid fa-location-dot ${style.location_i}`}></i> <span>{users.city} , {users.country}</span>
                  </div>
                  <div>
                    {users.isTrusted ? <span className={`${style.trusted}`}><i className={`fa-regular fa-circle-check ${style.check_icon}`}></i> Trusted</span> :
                      <span className={`${style.not_trusted}`}><i className={`fa-solid fa-exclamation ${style.check_icon}`}></i> Not Trusted</span>
                    }
                  </div>


                </div>
                <div className={`${style.ip}`}>IP: {users.ipAddress}</div>
                <div className={`${style.divider}`}></div>


                <div className={`${style.card_footer_parent}`}>
                  <div className={`${style.card_footer}`}>
                    <div className={`${style.label}`}>First Active</div>
                    <div className={`${style.value}`}>{formatDate(users.firstSeenAt)}</div>
                  </div>
                  <div className={`${style.card_footer}`}>
                    <div className={`${style.label}`}>Last Active</div>
                    {/* <div className={`${style.value}`}>{timeAgo(users.lastSeenAt)}</div> */}
                    <div className={`${style.value}`}>
                      {users.isCurrent ? "Active Now" : timeAgo(users.lastSeenAt)}
                    </div>

                  </div>
                </div>
              </div>
              {/* </div> */}

            </div>
            {
              users.isTrusted ? "" : <div className={`${style.divider2}`}></div>
            }


            {
              users.isTrusted ? "" : <div onClick={() => trustDevice(users.id)} className={`${style.trust_device}`}>
                <div>
                  <span className={`${style.trust_device_text}`}><i className={`fa-solid fa-shield ${style.sheild_icon}`}></i> Trust this device</span>
                </div>

              </div>
            }

            {
              users.isTrusted ?
                "" : <p className={`${style.trust_device_note}`}>A verification link will be sent to your email to approve this device.</p>

            }
          </div>

        ))}






        <button onClick={() => deleteUsers()} className={`${style.sign_out_all_btn}`}>
          <i className={`fa-solid fa-arrow-right-from-bracket ${style.sign_out_icon}`}></i>
          Sign Out From All Devices
        </button>
      </section>
    </main>


  </>
}
