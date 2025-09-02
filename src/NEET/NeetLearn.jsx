import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./NeetLearn.css";
import PadmasiniChat from "../components/PadmasiniChat";
import NeetExplanation from "./NeetExplanation";
import NeetQuiz from "./NeetQuiz";

// Recursive component to render subtopics and their tests
const SubtopicTree = ({
  subtopics,
  onClick,
  selectedTitle,
  parentIndex,
  level = 1,
}) => {
  const [expandedSub, setExpandedSub] = useState(null);

  const handleSubClick = (sub, idx) => {
    // Expand if children/tests exist
    if (
      (sub.units && sub.units.length > 0) ||
      (sub.test && sub.test.length > 0)
    ) {
      setExpandedSub((prev) => (prev === idx ? null : idx));
    }
    // Always open explanation as well
    onClick(sub, parentIndex);
  };

  const handleTestClick = (test, idx, sub) => {
    const testSubtopic = {
      ...sub,
      unitName: `Assessment - ${sub.unitName}`,
      test: [test],
    };
    onClick(testSubtopic, parentIndex);
  };

  return (
    <ul className="subtopics-list">
      {subtopics.map((sub, idx) => (
        <li key={idx}>
          <div
            className={`subtopic-title ${
              selectedTitle === sub.unitName ? "selected" : ""
            }`}
            style={{ marginLeft: `${level * 20}px` }}
            onClick={() => handleSubClick(sub, idx)}
          >
            📄 {sub.unitName}
          </div>

          {/* Show tests when expanded */}
          {expandedSub === idx &&
            sub.test &&
            sub.test.length > 0 &&
            sub.test.map((test, tIdx) => (
              <div
                key={tIdx}
                className="subtopic-title test-title"
                style={{ marginLeft: `${(level + 1) * 20}px` }}
                onClick={() => handleTestClick(test, tIdx, sub)}
              >
                📝 {test.testName} - Assessment
              </div>
            ))}

          {/* Recursive children */}
          {expandedSub === idx && sub.units && (
            <SubtopicTree
              subtopics={sub.units}
              onClick={onClick}
              selectedTitle={selectedTitle}
              parentIndex={parentIndex}
              level={level + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
};


const NeetLearn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const subject = location.state?.subject || "Physics";
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const selectedStandard =
    currentUser.selectedStandard === "11th"
      ? 11
      : currentUser.selectedStandard === "12th"
      ? 12
      : null;
  const userId = currentUser?.id || "guest";
  const [fetchedUnits, setFetchedUnits] = useState([]);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [showTopics, setShowTopics] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [completedSubtopics, setCompletedSubtopics] = useState({});

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);
      if (!isNowMobile) setShowTopics(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const courseName = "professional";
    const subjectName = subject;
    const stringStandard =localStorage.getItem("currentClass");
    const standard = stringStandard?.replace(/\D/g, "");
console.log(localStorage.getItem("currentClass"))
//localStorage.removeItem("currentClass")
    const getAllSubjectDetails = () => {
      fetch(
        `http://localhost:3000/getSubjectDetails?courseName=${courseName}&subjectName=${subjectName}&standard=${standard}`,
        //  `https://studentpadmasini.onrender.com/getSubjectDetails?courseName=${courseName}&subjectName=${subjectName}&standard=${standard}`,
        // `https://padmasini-prod-api.padmasini.com/getSubjectDetails?courseName=${courseName}&subjectName=${subjectName}&standard=${standard}`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((resp) => resp.json())
        .then((data) => {
          console.log("details of units: ", data);
          setFetchedUnits(data);
        })
        .catch((err) => console.log("getting units error: ", err));
    };

    getAllSubjectDetails();

    // Load saved progress from localStorage
    const savedProgress = JSON.parse(
      localStorage.getItem(`completedSubtopics_${userId}_neet`) || "{}"
    );
    setCompletedSubtopics(savedProgress);
  }, []);

  // Recursively flatten all subtopics in a topic
  const collectAllSubtopics = (subs = []) =>
    subs.flatMap((s) => [s, ...(s.units ? collectAllSubtopics(s.units) : [])]);

  // Calculate % completion for a topic
  const calculateProgress = (topic) => {
    if (!topic || !topic.units) return 0;
    const allSubs = collectAllSubtopics(topic.units);
    const completedCount = allSubs.filter(
      (sub) => completedSubtopics[topic.unitName]?.[sub.unitName]
    ).length;
    const totalCount = allSubs.length;
    return totalCount === 0
      ? 0
      : Math.round((completedCount / totalCount) * 100);
  };

  const isTopicCompleted = (topic) => calculateProgress(topic) === 100;

  const isTopicUnlocked = (index) => {
    if (index === 0) return true; // Always unlock first topic
    return isTopicCompleted(fetchedUnits[index - 1]);
  };

  const toggleTopic = (index) => {
    if (!isTopicUnlocked(index)) return;
    setExpandedTopic((prev) => (prev === index ? null : index));
    setSelectedSubtopic(null);
  };

   const handleSubtopicClick = (sub, index) => {
    setSelectedSubtopic(sub);
    if (isMobile) setShowTopics(false);
    setExpandedTopic(index);
  };

  const handleBackToTopics = () => {
    setSelectedSubtopic(null);
    if (isMobile) setShowTopics(true);
  };

  const handleBackToSubjects = () => navigate("/Neet");

  const markSubtopicComplete = () => {
    if (!selectedSubtopic || expandedTopic === null) return;
    const topicTitle = fetchedUnits[expandedTopic].unitName;
    const subtopicTitle = selectedSubtopic.unitName;

    localStorage.setItem(`neet-completed-${subtopicTitle}`, "true");

    setCompletedSubtopics((prev) => {
      const topicProgress = prev[topicTitle] || {};
      if (topicProgress[subtopicTitle]) return prev;

      const updated = {
        ...prev,
        [topicTitle]: { ...topicProgress, [subtopicTitle]: true },
      };

      localStorage.setItem(
        `completedSubtopics_${userId}_neet`,
        JSON.stringify(updated)
      );
      return updated;
    });
  };

  const resetProgress = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all your NEET progress?"
    );
    if (!confirmReset) return;

    localStorage.removeItem(`completedSubtopics_${userId}_neet`);
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("neet-completed-")) {
        localStorage.removeItem(key);
      }
    });

    setCompletedSubtopics({});
    setExpandedTopic(null);
    setSelectedSubtopic(null);

    alert("Your NEET progress has been reset successfully.");
  };

  return (
    <div className="Neet-container">
      {isMobile && (
        <button
          className="toggle-btn"
          onClick={() => setShowTopics(!showTopics)}
        >
          <FaBars />
          <h2>{subject} Topics</h2>
        </button>
      )}
      {showTopics && (
        <div className="topics-list">
          <ul>
            {fetchedUnits.map((topic, index) => (
              <li key={index}>
                <div
                  className={`topic-title ${
                    expandedTopic === index ? "active" : ""
                  } ${!isTopicUnlocked(index) ? "locked" : ""}`}
                  onClick={() => toggleTopic(index)}
                >
                  {topic.unitName}
                  <div className="progress-bar-wrapper">
                    <div className="progress-info">
                      <span className="progress-inside">
                        {calculateProgress(topic)}%
                      </span>
                      <span className="expand-icon">
                        {expandedTopic === index ? "-" : "+"}
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${calculateProgress(topic)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {expandedTopic === index && topic.units && (
                  <SubtopicTree
                    subtopics={topic.units}
                    onClick={handleSubtopicClick}
                    selectedTitle={selectedSubtopic?.unitName}
                    parentIndex={index}
                  />
                )}

                {/* Topic-level tests */}
                {expandedTopic === index && topic.test?.length > 0 && (
                  <ul className="subtopics-list">
                    {topic.test.map((test, tIdx) => {
                      const testSubtopic = {
                        ...topic,
                        unitName: `Assessment - ${topic.unitName}`,
                        test: [test],
                      };
                      return (
                        <li
                          key={tIdx}
                          className="subtopic-title test-title"
                          onClick={() =>
                            handleSubtopicClick(testSubtopic, index)
                          }
                        >
                          📝 {test.testName} - Assessment
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button className="back-subjects-btn" onClick={handleBackToSubjects}>
              Back to Subjects
            </button>
            <button className="back-subjects-btn" onClick={resetProgress}>
              Reset Progress
            </button>
          </div>
        </div>
      )}
      <div className="explanation-container">
        {selectedSubtopic ? (
          selectedSubtopic.unitName.includes("Assessment") ? (
            <NeetQuiz
              topicTitle={fetchedUnits[expandedTopic]?.unitName}
              subtopicTitle={selectedSubtopic.unitName}
              test={selectedSubtopic.test || []}
              onBack={handleBackToTopics}
              onMarkComplete={markSubtopicComplete}
            />
          ) : (
            <NeetExplanation
              topicTitle={fetchedUnits[expandedTopic]?.unitName}
              subtopicTitle={selectedSubtopic.unitName}
              subject={subject}
              explanation={selectedSubtopic.explanation || ""}
              audioFileId={selectedSubtopic.audioFileId || []}
              onBack={handleBackToTopics}
              onMarkComplete={markSubtopicComplete}
            />
          )
        ) : (
          <div className="no-explanation">
            <h2>
              Welcome to {subject} - Std {selectedStandard}
            </h2>
            <p>Select a topic and subtopic to begin your learning journey.</p>
          </div>
        )}
      </div>
      <PadmasiniChat subjectName={subject} />
    </div>
  );
};

export default NeetLearn;
