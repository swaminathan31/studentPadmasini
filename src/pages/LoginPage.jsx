import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";

import loginIllustration from "../assets/loginIllustration.jpg";
import whatsappIcon from "../assets/WhatsApp_icon.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

 useEffect(() => {
   if (localStorage.getItem('currentUser')) {
    console.log('user already logged in no need for sign page');
    navigate('/home');
  }
  window.scrollTo(0, 0);
 }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // fetch("http://localhost:3000/login", {
      fetch("https://studentpadmasini.onrender.com/login", {
      // fetch("https://padmasini-prod-api.padmasini.com/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName: email,
        password: password
      })
    })
    .then(async resp => {
      const data = await resp.json();
      if(data.message==='Invalid credentials'){
        alert("no user or password matched")
        throw new Error(data.message || "Login failed");
      }
      if (data.message === 'Login successful') {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        login(data.user);
        navigate('/home');
      }
      if (!resp.ok) throw new Error(data.message || "Login failed");
      console.log("✅ Logged in:", data);
    })
    .catch(err => {
      console.log(err);
      return;
    });
  };

  const handleForgotPassword = async () => {
  if (!email) {
    alert("Please enter your email first");
    return;
  }

  try {
    // const resp = await fetch("http://localhost:3000/forgot-password", {
    const resp = await fetch("https://studentpadmasini.onrender.com/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await resp.json();

    if (!resp.ok) throw new Error(data.message || "Something went wrong");

    alert(data.message); // backend will send success message
    //navigate("/reset-password");
  } catch (err) {
    alert(err.message);
  }
};


  return (
    <div className="login-container">
      <div className="login-illustration">
        <img
          src={loginIllustration || "https://via.placeholder.com/400x300"}
          alt="Login Illustration"
        />
        <h1>Welcome Back</h1>
        <p>Log in to continue learning and exploring!</p>
      </div>

      <div className="login">
        <h2>Student Login</h2>
        <div className="login-form-box">
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="icon inside"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="login-form-actions">
              <button type="submit">Login</button>
              <p className="login-forgot-password" onClick={handleForgotPassword}>
                Forgot Password?
              </p>
              <p className="login-text">
                Don't have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                >
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <a
        href="https://wa.me/8248791389"
        className="whatsapp-chat-button"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <img
          src={whatsappIcon || "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"}
          alt="WhatsApp"
          className="whatsapp-icon"
        />
        <span>Chat with us on WhatsApp</span>
      </a>
    </div>
  );
};

export default LoginPage;
