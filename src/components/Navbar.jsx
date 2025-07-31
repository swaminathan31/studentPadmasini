// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import "./Navbar.css";
import { useUser } from "./UserContext"; // ✅ Correct way to use context

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { currentUser, logout } = useUser(); // ✅ Uses custom hook correctly
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch(`http://localhost:3000/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.message === "Logged out successfully") {
          localStorage.removeItem("currentUser");
          localStorage.removeItem("jeeSubjectCompletion");
          localStorage.removeItem("currentClassJee");
          localStorage.clear(); // Clear all local storage
          logout();
          setCoursesOpen(false);
          setUserDropdownOpen(false);
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = document.querySelectorAll(".dropdown-toggle, .dropdown-menu");
      const clickedInside = Array.from(dropdowns).some((el) =>
        el.contains(event.target)
      );
      if (!clickedInside) {
        setCoursesOpen(false);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const selectedCourse = currentUser?.selectedCourse;

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <Link to="/home" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={menuOpen ? "nav-links active" : "nav-links"}>
        {currentUser && (
          <li className="dropdown">
            <div
              className="dropdown-toggle"
              onClick={() => {
                setCoursesOpen((prev) => !prev);
                setUserDropdownOpen(false);
              }}
            >
              Courses {coursesOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {coursesOpen && (
              <ul className="dropdown-menu">
                {selectedCourse === "NEET" && (
                  <li>
                    <Link to="/NEET" onClick={() => setMenuOpen(false)}>
                      NEET
                    </Link>
                  </li>
                )}
                {selectedCourse === "JEE" && (
                  <li>
                    <Link to="/JEE" onClick={() => setMenuOpen(false)}>
                      JEE
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </li>
        )}

        <li className="dropdown">
          {currentUser ? (
            <>
              <div
                className="dropdown-toggle"
                onClick={() => {
                  setUserDropdownOpen((prev) => !prev);
                  setCoursesOpen(false);
                }}
              >
                Hi, {currentUser.firstname}{" "}
                {userDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {userDropdownOpen && (
                <ul className="dropdown-menu user-details-dropdown">
                  <div className="user-details-header">
                    <li>
                      <img
                        src={currentUser.photo}
                        alt="user"
                        className="user-photo"
                      />
                    </li>
                    <li>
                      <strong>Name:</strong> {currentUser.firstname}{" "}
                      {currentUser.lastname}
                    </li>
                    <li>
                      <strong>Email:</strong> {currentUser.email}
                    </li>
                    <li>
                      <strong>Mobile:</strong> {currentUser.mobile}
                    </li>
                    <li>
                      <strong>Role:</strong>{" "}
                      {currentUser.selectedCourse?.toUpperCase()}
                    </li>
                    <li>
                      <strong>Standard:</strong> {currentUser.selectedStandard}
                    </li>
                    <li>
                      <button
                        className="upgrade-btn"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate("/register?step=2&upgrade=true");
                        }}
                      >
                        🪙 Upgrade Plan
                      </button>
                    </li>
                    <li>
                      <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt style={{ marginRight: "8px" }} />
                        Logout
                      </button>
                    </li>
                  </div>
                </ul>
              )}
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
