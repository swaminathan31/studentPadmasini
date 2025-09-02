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
  const {login}=useUser()
  const { currentUser, logout } = useUser(); // ✅ Uses custom hook correctly
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch(`http://localhost:3000/logout`, {
      // fetch(`https://studentpadmasini.onrender.com/logout`, {
      // fetch(`https://padmasini-prod-api.padmasini.com/logout`, {
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
 useEffect(()=>{
  fetch('http://localhost:3000/checkSession',{
    // fetch(`https://studentpadmasini.onrender.com/checkSession`, {
    //  fetch(`https://padmasini-prod-api.padmasini.com/checkSession`, {
    method:"GET",
    credentials:'include'
  }).then(resp=> resp.json())
  .then(data=>{
    console.log(data)
    if(data.loggedIn===true){
      login(data.user)
      //localStorage.clear();
       //console.log(localStorage.getItem('currentUser'))
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      //  logout(localStorage.getItem('currentUser'))
       console.log(localStorage.getItem('currentUser'))
       //onsole.log(currentUser)
    }
    if(data.loggedIn===false){
      console.log('it came here before seeing user')
const existingUser=localStorage.getItem('currentUser')
  if(existingUser){
    console.log('it came here and deleted the user')
   // localStorage.removeItem("currentUser");
          //localStorage.removeItem("jeeSubjectCompletion");
          //localStorage.removeItem("currentClassJee");
          localStorage.clear(); // Clear all local storage
          logout();
          setCoursesOpen(false);
          setUserDropdownOpen(false);
          navigate("/login");
  }
    }
  }).catch(console.error)
  
 },[])
 useEffect(() => {
  console.log("Current user is now:", currentUser);
}, [currentUser]);
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
//     let selectedCourse=[]
// if(Array.isArray(currentUser?.selectedCourse)){
//   selectedCourse=currentUser?.selectedCourse
// }else {
// selectedCourse=[currentUser?.selectedCourse]
// }
// let selectedStandard=[]
// if(Array.isArray(currentUser?.selectedStandard)){
// selectedStandard=currentUser?.selectedStandard
// }else {
// selectedStandard=[currentUser?.selectedStandard]
// }
   // Extract courses (keys of the object)
let selectedCourse = [];
let selectedStandard = [];

if (currentUser?.selectedCourse && typeof currentUser.selectedCourse === "object") {
  selectedCourse = Object.keys(currentUser.selectedCourse);

  // Flatten all standards into one array (avoid duplicates)
  selectedStandard = [
    ...new Set(Object.values(currentUser.selectedCourse).flat())
  ];
}

//console.log(selectedCourse)
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
             <span>Courses</span>
  <span className="dropdown-icon">
    {coursesOpen ? <FaChevronUp /> : <FaChevronDown />}
  </span></div>
            {coursesOpen && (
              <ul className="dropdown-menu">
                {selectedCourse.map((course) => (
      <li key={course}>
        <Link
          to={`/${course}`}
          onClick={() => setMenuOpen(false)}
        >
          {course}
        </Link>
      </li>
    ))}
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
                <span>Hi, {currentUser.firstname}</span>
               <span className="dropdown-icon">
          {userDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
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
                      <strong>Courses:</strong>{" "}
                      {selectedCourse?.join(",")}
                    </li>
                    <li>
                      <strong>Standards:</strong> {selectedStandard?.join(",")}
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

