import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ResetPassword.css";
import whatsappIcon from "../assets/WhatsApp_icon.png"; // Adjust path if needed

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password reset successful!");
    navigate("/login");
  };

  return (
    <div className="reset-container">
      <h2>Reset Password</h2>
      <div className="reset-form-box">
      <form onSubmit={handleReset}>
<div className="input-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="New Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <span className="icon" onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

<div className="input-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
  />
  <span className="icon" onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

        <div className="password-requirements">
        <button  type="submit">Reset Password</button>
        </div>
        
      </form>
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

export default ResetPassword;
