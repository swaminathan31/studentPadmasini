import React, { useState, useEffect } from "react";
import { useNavigate, Link , useLocation} from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Registration.css";
import registerIllustration from "../assets/registerIllustration.jpg";
import whatsappIcon from "../assets/WhatsApp_icon.png";

const RegistrationFlow = () => {
  const [step, setStep] = useState(1);

  // Step 1 states
  const [firstname, setUsername] = useState("");
  const [lastname, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [otp, setOtp]=useState("")
  const [otpError, setOtpError]=useState("")
  const [otpSent, setOtpSent] = useState(false);

  // Step 2 states
  const [photo, setPhoto] = useState(null);
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("");
const [photoPreview, setPhotoPreview] = useState(null);

  // Step 3 states
  const [selectedPlan, setSelectedPlan] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stepFromURL = parseInt(queryParams.get("step"));
  const isUpgrade = queryParams.get("upgrade") === "true";
  const [isVerified, setIsVerified] = useState(false);
useEffect(()=>{
// const existingUser=localStorage.getItem('currentUser')
// if(existingUser){
//   console.log("user already logged in")
//   navigate('/home')
// }



   const useMe1=localStorage.getItem("registeredUser")
  if(useMe1){
    console.log("useMe1")
    try {
      const useMe = JSON.parse(useMe1);
      setUsername(useMe.firstname||"");
      setStudentName(useMe.lastname||"");
      setEmail(useMe.email||"");
      setPassword(useMe.password||"");
      setConfirmPassword(useMe.confirmPassword||"");
      setMobile(useMe.mobile||"");
      localStorage.removeItem("registeredUser")
    } catch (err) {
      console.error('Invalid JSON in localStorage:', err);
    }
  }
  
},[])
  useEffect(() => {
    if (stepFromURL === 2) setStep(2);
    if (stepFromURL === 3) setStep(3);
    window.scrollTo(0, 0);
  }, [stepFromURL]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);
const storeLocal=()=>{
  console.log("use me too")
  localStorage.setItem("registeredUser", JSON.stringify({ firstname, lastname, email, mobile, password,confirmPassword }));
}
 const handleStepOneSubmit = (e) => {
  console.log(localStorage.getItem("registeredUser"))
    e.preventDefault();
    if (!validateEmail(email)) return setEmailError("Please enter a valid email address.");
    else setEmailError("");
    if (!validateMobile(mobile)) return setMobileError("Please enter a valid 10-digit mobile number.");
    else setMobileError("");
    if (password !== confirmPassword) return alert("Passwords do not match!");
    localStorage.setItem("registeredUser", JSON.stringify({ firstname, lastname, email, mobile, password,confirmPassword }));
    setStep(2);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
    setPhoto(file); // store actual File object
    const localUrl = URL.createObjectURL(file);
    setPhotoPreview(localUrl); // preview photo on UI
  }
  };
const sendUserDetails=async () => {
  const formData = new FormData();

  formData.append('firstname', firstname);
  formData.append('lastname', lastname);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('mobile', mobile);
  formData.append('dob', dob);
  formData.append('gender', gender);
  formData.append('selectedCourse', selectedCourse);
  formData.append('selectedStandard', selectedStandard);

  // append photo only if selected
  if (photo) {
    console.log("photo is there")
    formData.append('photo', photo);
  }
console.log(selectedCourse,"  ",selectedStandard)
  try {
    // const response = await fetch('http://localhost:3000/register/newUser', {
      const response = await fetch('https://studentpadmasini.onrender.com/register/newUser', {
      // const response = await fetch('https://padmasini-prod-api.padmasini.com/register/newUser', {
      method: 'POST',
      body: formData, // Do not set Content-Type; browser sets it with boundary
    });

    const data = await response.json();

    if (response.ok) {
     // localStorage.removeItem("registeredUser")
      alert(data.message);
      navigate('/Login')
      // optionally redirect or reset form here
    } else {
      alert(data.error || "Registration failed");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("Something went wrong");
  }
};
  const handleFinalSubmit = (e) => {
    e.preventDefault();
     if (!isUpgrade) {
    if ( !dob || !gender || !selectedCourse) {
      return alert("Please fill in all required fields.");
    }
  } else {
    if (!selectedCourse) {
      return alert("Please select your course.");
    }
  }
   // if ( !dob || !gender || !selectedCourse) return alert("Please fill in all required fields.");//removed !photo||
   if (
  (selectedCourse === "JEE" ||
    selectedCourse === "NEET" ||
    selectedCourse === "Both") &&
  !selectedStandard
) {
  return alert("Please select your standard (11th, 12th or Both).");
}
   // if ((selectedCourse === "JEE" || selectedCourse === "NEET") && !selectedStandard) return alert("Please select your standard (11th or 12th).");
 let normalizedStandard = selectedStandard;
if (selectedStandard === "Both (11th + 12th)") {
  normalizedStandard = "both";
}
   const updatedUser = JSON.parse(localStorage.getItem("registeredUser") || "{}");
    updatedUser.dob = dob;
    updatedUser.gender = gender;
    updatedUser.course = selectedCourse;
    updatedUser.standard = selectedStandard;
    updatedUser.role = selectedCourse.toLowerCase();
    if (!isUpgrade) {
  updatedUser.photo = photo;
}

    localStorage.setItem("registeredUser", JSON.stringify(updatedUser));
    
    setStep(3);
  };

 const completePayment = (method) => {
    setPaymentMethod(method);
      if (["Google Pay", "PhonePe", "Paytm"].includes(method)) {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      alert(`${method} Payment Successful!`);
    }, 2000);
  }
  };
   const sendOtp=async(e)=>{
    e.preventDefault();
    if (!email) {
    setEmailError("Please enter an email first");
    return;
    }
    if (!validateEmail(email)) return setEmailError("Please enter a valid email address.");
    else setEmailError("");
    setEmailError(""); 
    try {
    // const res = await fetch("http://localhost:3000/auth/send-otp", {
      const res = await fetch("https://studentpadmasini.onrender.com/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    console.log("status:", res.status);
    const data = await res.json();
    if (res.ok) {
      setOtpSent(true);
      console.log("otp send successfully")
      alert(data.message);
    } else {
      alert(data.message || "Failed to send OTP");
    }
  } catch (err) {
    console.error(err);
    alert("Error sending OTP");
  }
    
    
   }
   const verifyOtp=async(e)=>{
 e.preventDefault();
  if (!otp) return setOtpError("Please enter OTP");
   try {
    // const res = await fetch("http://localhost:3000/auth/verify-otp", {
      const res = await fetch("https://studentpadmasini.onrender.com/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (res.ok) {
      setIsVerified(true);

      localStorage.setItem("emailVerification", "success");
      alert("Email verified successfully ✅");
    } else {
      setOtpError(data.message || "Invalid OTP");
    }
  } catch (err) {
    console.error(err);
    setOtpError("Error verifying OTP");
  }
   }

   const isEmailVerified=()=>{
    const emailVerification=localStorage.getItem("emailVerification")
    console.log(emailVerification)
    if(emailVerification!=='success'){
      alert("Please verify your email to proceed to Next Step")
      return true
    }
    return false
   }
  const handlePayNowClick = () => {
    if (!selectedPlan) return alert("Please select a plan.");
    setShowPaymentOptions(true);
  };

const currentUserCourses=()=>{
  const currentUser=JSON.parse(localStorage.getItem("currentUser"))
  if(currentUser){
    let userCourse=currentUser.selectedCourse
    if(typeof userCourse==='string'){
      userCourse=[userCourse]
    }
    
      return (
        
        <div>
          Your current course: {userCourse?.join(",")}
          </div>
        
      )
    
  }
}

  const handleFinalPayment = () => {
    if (paymentMethod === "UPI" && !upiId) return alert("Enter UPI ID");
    if (paymentMethod === "Net Banking" && !bank) return alert("Select a bank");
    if (paymentMethod === "Credit/Debit Card" && (!cardNumber || !expiry || !cvv)) return alert("Fill all card details");

    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymenySuccess(true)
      alert(`Payment successful using ${paymentMethod}`);
      const user = JSON.parse(localStorage.getItem("registeredUser") || "{}");
      const startDate = new Date();
      let endDate;

      if (selectedPlan === "trial") {
        endDate = new Date(startDate.getTime() + 15 * 24 * 60 * 60 * 1000);
      } else if (selectedPlan === "monthly") {
        endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      } else if (selectedPlan === "yearly") {
        endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
      }

      user.plan = selectedPlan;
      user.startDate = startDate.toISOString().split("T")[0];
      user.endDate = endDate.toISOString().split("T")[0];
      localStorage.setItem("registeredUser", JSON.stringify(user));
      // sendUserDetails() //change for backend connection
      localStorage.removeItem("emailVerification")
      console.log(JSON.stringify(user))
      alert(`Login successful! Welcome ${user.firstname}`);
      
    }, 2000);
  };

  return (
    <div className="registration-container">
      <div className="registration-illustration">
        <img src={registerIllustration} alt="Register Illustration" />
        <h1>Welcome to Our Platform</h1>
        <p>Join us to explore amazing features and opportunities!</p>
      </div>

      <div className="registration">
        {step === 1 && (
          <>
          
            <h2>Register Now</h2>
            <div className="Register-form-box">
              <form onSubmit={handleStepOneSubmit}>
                <div className="name-container">
                  <input type="text" placeholder="Student First Name" value={firstname} onChange={(e) => setUsername(e.target.value)} required className="half-width" />
                  <input type="text" placeholder="Student Last Name" value={lastname} onChange={(e) => setStudentName(e.target.value)} required className="half-width" />
                </div>

                <input type="email" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)} required />
                {emailError && <span className="error-message">{emailError}</span>}
                
                {!otpSent && (<button type="none" className="verifyOtp" onClick={sendOtp}>Send Otp</button>)}
                
                {otpSent && (
  <>
    <input 
      type="text" 
      placeholder="Enter OTP" 
      value={otp} 
      onChange={(e) => setOtp(e.target.value)} 
      disabled={isVerified}
    />
    {otpError && <span className="error-message">{otpError}</span>}
    <button type="button" className={`verifyOtp ${isVerified ? "verified" : ""}`}  onClick={verifyOtp} disabled={isVerified}> {isVerified ? "Verified ✅" : "Verify OTP"}</button>
  </>
)}

                <input type="tel" placeholder="Mobile No." value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                {mobileError && <span className="error-message">{mobileError}</span>}

                <div className="password-container">
                  <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="password-input" />
                  <span className="icon inside" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>

                <div className="password-container">
                  <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="password-input" />
                  <span className="icon inside" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>

                <div className="form-actions">
                  <div className="checkbox-container">
                    <input type="checkbox" id="agree" required />
                    <label htmlFor="agree">
                      I have agreed to the <Link to="/terms" onClick={storeLocal} className="footer-link">Terms and Conditions</Link>
                    </label>
                  </div>

                  <button onClick={isEmailVerified} type="submit">Next</button>

                  <p className="login-text">
                    Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>Login</a>
                  </p>
                </div>
              </form>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="student-details">
             <h2>{isUpgrade ? "Update Plan" : "Student Details"}</h2>
{           isUpgrade&&currentUserCourses()
             }
          <div className="student-details-wrapper">
            {!isUpgrade && (
            <div className="left-section">
              <p className="upload-text">Upload Profile Picture *</p>
              <label htmlFor="file-input" className="custom-upload">
                {photoPreview ? <img src={photoPreview} alt="Profile" className="profile-preview" /> : <span className="upload-placeholder">+</span>}
              </label>
              <input id="file-input" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden-input" />
            </div>

            )}
            <div className="right-section">
              <form onSubmit={handleFinalSubmit}>
                  {!isUpgrade && (
                    <>
                <input  type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />

                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
</>
                  )}
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
                  <option value="">Course</option>
                  {/* <option value="kid">Kindergarten</option>
                  <option value="first">Class 1-5</option>
                  <option value="six">Class 6-12</option> */}
                  <option value="JEE">JEE</option>
                  <option value="NEET">NEET</option>
                  <option value="Both">Both (JEE + NEET)</option>
                  <option value="Other">Other</option>
                </select>

                {(selectedCourse === "first" || selectedCourse === "six" || selectedCourse === "JEE" || selectedCourse === "NEET"||selectedCourse === "Both") && (
                  <select value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)} required>
                    <option value="">Select Standard</option>
                    {/* {selectedCourse === "first" && [1,2,3,4,5].map(n => <option key={n}>{n}</option>)}
                    {selectedCourse === "six" && [6,7,8,9,10,11,12].map(n => <option key={n}>{n}</option>)} */}
                    {["11th", "12th", "Both (11th + 12th)"].map(std => <option key={std} value={std}>{std}</option>)}
                  </select>
                )}
                <div className="student-navigation-buttons">
                 <button type="button" onClick={() => (isUpgrade ? navigate("/home") : setStep(1))}>Previous</button>
<button type="submit">Next</button>
                </div>

              </form>
            </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="payment-section">
           <h2>{isUpgrade ? "Upgrade Your Plan" : "Select Your Plan"}</h2>
          <div className="payment-selection">
            

            <div className="plans">
                 {!isUpgrade && (
              <label><input type="radio" name="plan" value="trial" checked={selectedPlan === "trial"} onChange={() => setSelectedPlan("trial")} /> 15-day Free Trial</label>)}
              {/* <label><input type="radio" name="plan" value="monthly" checked={selectedPlan === "monthly"} onChange={() => setSelectedPlan("monthly")} /> 1 Month – ₹1000</label>
              <label><input type="radio" name="plan" value="yearly" checked={selectedPlan === "yearly"} onChange={() => setSelectedPlan("yearly")} /> 1 Year – ₹12000</label> */}
             {isUpgrade && (
          <>
            <label>
              <input
                type="radio"
                name="plan"
                value="monthly"
                checked={selectedPlan === "monthly"}
                onChange={() => setSelectedPlan("monthly")}
              />
              1 Month – ₹1000
            </label>
            <label>
              <input
                type="radio"
                name="plan"
                value="yearly"
                checked={selectedPlan === "yearly"}
                onChange={() => setSelectedPlan("yearly")}
              />
              1 Year – ₹12000
            </label>
          </>
        )}
            </div>

            <div className="promo-section">
              <input type="text" placeholder="Enter Promo Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <button onClick={() => alert("Promo Applied: " + promoCode)}>Apply</button>
            </div>
{showPaymentOptions && (
              <div className="payment-options-modal">
                <h3>Select Payment Method</h3>
                <div className="methods">
                  <button onClick={() => completePayment("Google Pay")}>Google Pay</button>
                  <button onClick={() => completePayment("PhonePe")}>PhonePe</button>
                  <button onClick={() => completePayment("Paytm")}>Paytm</button>
                 <button onClick={() => setPaymentMethod("UPI")}>UPI</button>
            <button onClick={() => setPaymentMethod("Net Banking")}>Net Banking</button>
            <button onClick={() => setPaymentMethod("Credit/Debit Card")}>Credit/Debit Card</button>
                </div>
                          {paymentMethod === "UPI" && (
            <div>
              <input type="text" placeholder="Enter UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
            </div>
          )}

          {paymentMethod === "Net Banking" && (
            <div>
              <select value={bank} onChange={(e) => setBank(e.target.value)}>
                <option value="">-- Select Bank --</option>
                <option value="SBI">State Bank of India</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="Axis">Axis Bank</option>
              </select>
            </div>
          )}

          {paymentMethod === "Credit/Debit Card" && (
            <div>
              <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
              <input type="month" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
              <input type="password" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={3} />
            </div>
          )}

          {paymentMethod && !paymentSuccess &&(
            <button onClick={handleFinalPayment} disabled={isPaying}>
              {isPaying ? "Processing..." : "Pay Now"}
            </button>
          )}
           {paymentSuccess && (
  <button
    onClick={async () => {
      setIsSubmitting(true);
       sendUserDetails();
      setIsSubmitting(false);

      const user = JSON.parse(sessionStorage.getItem("registeredUser") || "{}");
      alert(`Registration Completed Successfully! Welcome ${user.firstname || ""} ${user.lastname || ""}`);

      //navigate("/login");
    }}
    disabled={isSubmitting}
  >
    {isSubmitting ? "Submitting..." : "Submit"}
  </button>
)}
        </div>
            )}
            <div className="plans-navigation-buttons">
              <button onClick={() => setStep(2)}>Previous</button>
              {!paymentSuccess && (
              <button onClick={() => {
                if (!selectedPlan) return alert("Please select a plan.");
                setShowPaymentOptions(true);
              }}>
                Pay Now
              </button>
               )}
            </div>

            
          </div>
          </div>
        )}
      </div>
 {/* WhatsApp Button */}
      <a
        href="https://wa.me/8248791389"
        className="whatsapp-chat-button"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <img
          src={whatsappIcon}
          alt="WhatsApp"
          className="whatsapp-icon"
        />
        <span>Chat with us on whatsapp</span>
      </a>
    </div>
  );
};

export default RegistrationFlow;