import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PadmasiniChat from "../components/PadmasiniChat";
import "./JEE.css";
import physicsImg from "../assets/physics.jpg";
import chemistryImg from "../assets/chemistry.jpg";
import mathsImg from "../assets/maths.png";

const subjectList = [
  { name: "Physics", image: physicsImg, certified: false },
  { name: "Chemistry", image: chemistryImg, certified: false },
  { name: "Maths", image: mathsImg, certified: false },
];

const Jee = () => {
  const navigate = useNavigate();
  const [standard, setStandard] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjectCompletion, setSubjectCompletion] = useState(subjectList);
  const learningPathRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("registeredUser"));
    if (storedUser) {
      setStandard(storedUser.standard || "");

      if (storedUser.standard === "both") {
        const savedClass = localStorage.getItem("currentClassJee") || "";
        setSelectedClass(savedClass);
      }

      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };

      if (storedUser.startDate) setStartDate(formatDate(storedUser.startDate));
      if (storedUser.endDate) setEndDate(formatDate(storedUser.endDate));
    }

    const savedCompletion = JSON.parse(localStorage.getItem("jeeSubjectCompletion"));
    if (savedCompletion) {
      setSubjectCompletion(savedCompletion);
    }
  }, []);

  const handleClassChange = (e) => {
    const selected = e.target.value;
    setSelectedClass(selected);
    localStorage.setItem("currentClassJee", selected);
  };

  const handleScrollToLearningPath = () => {
    if (learningPathRef.current) {
      learningPathRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const calculateProgress = () => {
    const completedSubjects = subjectCompletion.filter((subject) => subject.certified).length;
    return (completedSubjects / subjectCompletion.length) * 100;
  };

  const progressPercentage = calculateProgress();

  const handleSubjectCompletion = (subjectName) => {
    const updatedSubjects = subjectCompletion.map((subject) =>
      subject.name === subjectName ? { ...subject, certified: true } : subject
    );
    setSubjectCompletion(updatedSubjects);
    localStorage.setItem("jeeSubjectCompletion", JSON.stringify(updatedSubjects));
  };

  useEffect(() => {
    const completedSubtopics = JSON.parse(localStorage.getItem("jeeCompletedSubtopics"));
    if (
      completedSubtopics &&
      Object.keys(completedSubtopics["UNIT AND MEASURE"] || {}).length === 6
    ) {
      handleSubjectCompletion("Physics");
    }
  }, []);

  return (
    <div className="subjects-page">
      <aside className="sidebar">
        <h2>JEE</h2>

        {standard && (
          <p>
            <strong>Standard:</strong>{" "}
            {standard === "11th" ? (
              "Class 11"
            ) : standard === "12th" ? (
              "Class 12"
            ) : (
              <select value={selectedClass} onChange={handleClassChange} required>
                <option value="">Select Class</option>
                <option value="11th">Class 11</option>
                <option value="12th">Class 12</option>
              </select>
            )}
          </p>
        )}

        <span className="badge certified">Certified</span>
        <span className="badge limited">Limited Access Only</span>

        {startDate && endDate && (
          <div className="cohort-details">
            <h4>Your Batch</h4>
            <p><strong>Start Date:</strong> {startDate}</p>
            <p><strong>End Date:</strong> {endDate}</p>
          </div>
        )}
      </aside>

      <main className="content">
        <section className="progress-section">
          <h3>My Completion Progress</h3>
          <div className="progress-header">
            <div className="progress-info">
              <p>{subjectCompletion.filter((s) => s.certified).length} of {subjectCompletion.length} subjects completed</p>

              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor:
                      progressPercentage === 100
                        ? "#4CAF50"
                        : progressPercentage > 50
                        ? "#FFEB3B"
                        : "#B0BEC5",
                  }}
                  title={`Completed: ${Math.round(progressPercentage)}%`}
                >
                  <div className="progress-filled">
                    <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
                  </div>
                </div>
              </div>

              <p className="subtext">
                {progressPercentage === 100
                  ? "You've completed all subjects!"
                  : "Complete all mandatory subjects to earn your certificate"}
              </p>
            </div>

            <div className="certificate-box">
              <button
                className={`certificate-btn ${progressPercentage === 100 ? "btn-completed" : "btn-continue"}`}
                onClick={handleScrollToLearningPath}
              >
                {progressPercentage === 100 ? "Download Certificate" : "Continue Learning"}
              </button>
            </div>
          </div>
        </section>

        <section className="learning-path" ref={learningPathRef}>
          <h3>Learning Path</h3>
          <div className="timeline">
            {subjectCompletion.map((subject, index) => (
              <div key={subject.name} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className={`subject-card subject-card-${index}`}>
                    <img src={subject.image} alt={subject.name} className="subject-thumbnail" />
                    <div className="jee-subject-info">
                      <span className="course-number">Course {index + 1}</span>
                      <h4 className="subject-title">{subject.name}</h4>
                      {subject.certified && <span className="certified-badge">Certified</span>}
                    </div>
                    <button
                      className="continue-btn"
                      onClick={() =>
                        navigate("/JeeLearn", {
                          state: {
                            subject: subject.name,
                            selectedClass: standard === "both" ? selectedClass : standard,
                          },
                        })
                      }
                      disabled={standard === "both" && !selectedClass}
                    >
                      {subject.certified ? "Review" : "Learn More"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PadmasiniChat subjectName="JEE" />
    </div>
  );
};

export default Jee;
