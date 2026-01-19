"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CookieBanner } from "./components/CookieBanner";
import { GovukHeader } from "./components/GovukHeader";
import { GovukFooter } from "./components/GovukFooter";
import { QUESTIONS, MOCK_ANSWERS, type Question } from "./components/questions-config";

// Styles object for GOV.UK design
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    backgroundColor: "#fff",
  },
  main: {
    flex: 1,
    maxWidth: "960px",
    margin: "0 auto",
    padding: "40px 15px",
    width: "100%",
  },
  // Form group
  formGroup: {
    marginBottom: "30px",
  },
  // Question title (h1)
  questionTitle: {
    fontSize: "36px",
    fontWeight: 700,
    lineHeight: 1.1,
    margin: "0 0 20px 0",
    color: "#0b0c0c",
  },
  // Hint text
  hint: {
    fontSize: "16px",
    lineHeight: 1.5,
    color: "#505a5f",
    marginBottom: "15px",
    whiteSpace: "pre-line" as const,
  },
  // Text input
  textInput: {
    width: "100%",
    maxWidth: "500px",
    padding: "10px",
    fontSize: "19px",
    lineHeight: 1.3,
    border: "2px solid #0b0c0c",
    borderRadius: 0,
    appearance: "none" as const,
    outline: "none",
  },
  textInputFilling: {
    borderColor: "#1d70b8",
    backgroundColor: "#e8f4fc",
    boxShadow: "0 0 0 3px #1d70b8",
  },
  // Select
  select: {
    width: "100%",
    maxWidth: "500px",
    padding: "10px",
    fontSize: "19px",
    lineHeight: 1.3,
    border: "2px solid #0b0c0c",
    borderRadius: 0,
    backgroundColor: "#fff",
  },
  // Radio group
  radioGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  radioItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "10px",
    cursor: "pointer",
  },
  radioInput: {
    width: "40px",
    height: "40px",
    margin: 0,
    cursor: "pointer",
  },
  radioLabel: {
    fontSize: "19px",
    color: "#0b0c0c",
    cursor: "pointer",
  },
  // Button
  button: {
    backgroundColor: "#00703c",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontSize: "19px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 0 #002d18",
    marginRight: "15px",
  },
  buttonSecondary: {
    backgroundColor: "#f3f2f1",
    color: "#0b0c0c",
    border: "none",
    padding: "10px 20px",
    fontSize: "19px",
    fontWeight: 400,
    cursor: "pointer",
    boxShadow: "0 2px 0 #929191",
  },
  // Date inputs
  dateInputs: {
    display: "flex",
    gap: "20px",
  },
  dateInput: {
    width: "70px",
    padding: "10px",
    fontSize: "19px",
    lineHeight: 1.3,
    border: "2px solid #0b0c0c",
    borderRadius: 0,
    textAlign: "center" as const,
  },
  dateInputYear: {
    width: "100px",
  },
  dateLabel: {
    display: "block",
    fontSize: "16px",
    fontWeight: 400,
    marginBottom: "5px",
    color: "#0b0c0c",
  },
};

export default function MockFormPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [fillingFieldId, setFillingFieldId] = useState<string | null>(null);
  const autoFillRef = useRef(false);

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentPage];
  const isReviewPage = currentPage >= totalQuestions;

  // Handle answer change
  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Navigate to next page
  const goToNext = useCallback(() => {
    if (currentPage < totalQuestions) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalQuestions]);

  // Navigate to previous page
  const goToPrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Listen for auto-fill trigger from extension
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "FORM_PILOT_START_FILL") {
        console.log("[Mock Form] Received start fill command");
        startAutoFill();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Auto-fill process
  const startAutoFill = useCallback(async () => {
    if (autoFillRef.current) return;
    autoFillRef.current = true;
    setIsAutoFilling(true);
    setCurrentPage(0);

    // Notify extension that filling started
    window.postMessage({ type: "FORM_PILOT_FILLING_STARTED" }, "*");

    for (let i = 0; i < QUESTIONS.length; i++) {
      const question = QUESTIONS[i];
      const value = MOCK_ANSWERS[question.id];

      if (value) {
        setCurrentPage(i);
        setFillingFieldId(question.id);

        // Wait for page transition
        await new Promise(resolve => setTimeout(resolve, 300));

        // Fill the field
        setAnswers(prev => ({ ...prev, [question.id]: value }));

        // Notify extension of progress
        window.postMessage({
          type: "FORM_PILOT_PROGRESS",
          currentPage: i + 1,
          totalPages: QUESTIONS.length,
          fieldId: question.id,
        }, "*");

        // Wait before moving to next
        await new Promise(resolve => setTimeout(resolve, 500));
        setFillingFieldId(null);

        // Click next
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    // Go to review page
    setCurrentPage(QUESTIONS.length);
    setIsAutoFilling(false);
    autoFillRef.current = false;

    // Notify completion
    window.postMessage({
      type: "FORM_PILOT_COMPLETE",
      status: "success",
      filledFields: Object.keys(MOCK_ANSWERS).length,
    }, "*");
  }, []);

  // Render form field based on type
  const renderField = (question: Question) => {
    const value = answers[question.id] || "";
    const isFilling = fillingFieldId === question.id;

    switch (question.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <input
            id={question.id}
            type={question.type === "tel" ? "tel" : "text"}
            value={value}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            style={{
              ...styles.textInput,
              ...(isFilling ? styles.textInputFilling : {}),
            }}
            autoComplete="off"
          />
        );

      case "date":
        // Parse date value (YYYY-MM-DD format)
        const [year = "", month = "", day = ""] = value.split("-");
        const handleDateChange = (part: "day" | "month" | "year", val: string) => {
          const d = part === "day" ? val : day;
          const m = part === "month" ? val : month;
          const y = part === "year" ? val : year;
          handleAnswer(question.id, `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
        };

        return (
          <div style={styles.dateInputs}>
            <div>
              <label style={styles.dateLabel}>Day</label>
              <input
                type="text"
                maxLength={2}
                value={day}
                onChange={(e) => handleDateChange("day", e.target.value)}
                style={{
                  ...styles.dateInput,
                  ...(isFilling ? styles.textInputFilling : {}),
                }}
                placeholder="DD"
              />
            </div>
            <div>
              <label style={styles.dateLabel}>Month</label>
              <input
                type="text"
                maxLength={2}
                value={month}
                onChange={(e) => handleDateChange("month", e.target.value)}
                style={{
                  ...styles.dateInput,
                  ...(isFilling ? styles.textInputFilling : {}),
                }}
                placeholder="MM"
              />
            </div>
            <div>
              <label style={styles.dateLabel}>Year</label>
              <input
                type="text"
                maxLength={4}
                value={year}
                onChange={(e) => handleDateChange("year", e.target.value)}
                style={{
                  ...styles.dateInput,
                  ...styles.dateInputYear,
                  ...(isFilling ? styles.textInputFilling : {}),
                }}
                placeholder="YYYY"
              />
            </div>
          </div>
        );

      case "radio":
        return (
          <div style={styles.radioGroup}>
            {question.options?.map((option) => (
              <label
                key={option}
                style={{
                  ...styles.radioItem,
                  backgroundColor: value === option ? "#e8f4fc" : "transparent",
                  border: isFilling && value === option ? "3px solid #1d70b8" : "none",
                }}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  style={styles.radioInput}
                />
                <span style={styles.radioLabel}>{option}</span>
              </label>
            ))}
          </div>
        );

      case "select":
        return (
          <select
            id={question.id}
            value={value}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            style={{
              ...styles.select,
              ...(isFilling ? styles.textInputFilling : {}),
            }}
          >
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option || "-- Please select --"}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  // Render review page
  const renderReviewPage = () => (
    <div>
      <h1 style={styles.questionTitle}>Check your answers</h1>
      <p style={styles.hint}>Review your answers before submitting your application.</p>

      <dl style={{ marginTop: "30px" }}>
        {QUESTIONS.map((q) => (
          <div
            key={q.id}
            style={{
              borderBottom: "1px solid #b1b4b6",
              padding: "15px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <dt style={{ fontWeight: 600, color: "#0b0c0c", fontSize: "16px", flex: 1 }}>
              {q.title.replace("What is your ", "").replace("?", "")}
            </dt>
            <dd style={{ margin: 0, color: "#0b0c0c", fontSize: "16px", flex: 1 }}>
              {answers[q.id] || <span style={{ color: "#505a5f" }}>Not provided</span>}
            </dd>
            <dd style={{ margin: 0 }}>
              <button
                onClick={() => setCurrentPage(QUESTIONS.findIndex((x) => x.id === q.id))}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1d70b8",
                  fontSize: "16px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Change
              </button>
            </dd>
          </div>
        ))}
      </dl>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => {
            setIsCompleted(true);
            alert("Application submitted successfully! (Demo)");
          }}
          style={styles.button}
        >
          Accept and submit
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <CookieBanner />
      <GovukHeader />

      <main style={styles.main}>
        {isReviewPage ? (
          renderReviewPage()
        ) : (
          <div>
            {/* Question number indicator */}
            <p style={{ fontSize: "16px", color: "#505a5f", marginBottom: "10px" }}>
              Question {currentPage + 1} of {totalQuestions}
            </p>

            {/* Question title */}
            <h1 style={styles.questionTitle}>{currentQuestion.title}</h1>

            {/* Hint text */}
            {currentQuestion.hint && (
              <p style={styles.hint}>{currentQuestion.hint}</p>
            )}

            {/* Form field */}
            <div style={styles.formGroup}>{renderField(currentQuestion)}</div>

            {/* Navigation buttons */}
            <div style={{ marginTop: "40px" }}>
              <button
                id="next-button"
                onClick={goToNext}
                style={styles.button}
                disabled={isAutoFilling}
              >
                {currentPage === totalQuestions - 1 ? "Continue to review" : "Next"}
              </button>

              {currentPage > 0 && (
                <button
                  onClick={goToPrevious}
                  style={styles.buttonSecondary}
                  disabled={isAutoFilling}
                >
                  Previous
                </button>
              )}
            </div>

            {/* Auto-fill indicator */}
            {isAutoFilling && (
              <div
                style={{
                  marginTop: "30px",
                  padding: "15px",
                  backgroundColor: "#e8f4fc",
                  border: "2px solid #1d70b8",
                }}
              >
                <p style={{ margin: 0, color: "#0b0c0c", fontSize: "16px" }}>
                  <strong>Form Pilot is auto-filling this form...</strong>
                </p>
                <p style={{ margin: "5px 0 0", color: "#505a5f", fontSize: "14px" }}>
                  Page {currentPage + 1} of {totalQuestions}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <GovukFooter />
    </div>
  );
}
