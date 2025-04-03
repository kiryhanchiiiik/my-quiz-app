import { useState, useEffect } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import { config } from "../../config";
import ProgressBar from "../ProgressBar/ProgressBar";
import css from "./Quiz.module.css";
import Loader from "../Loader/Loader";

const Quiz = () => {
  const [steps, setSteps] = useState([]);
  const [questionsByStep, setQuestionsByStep] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [showResultOnly, setShowResultOnly] = useState(false);

  const fetchQuizData = async () => {
    try {
      const url = `spaces/${config.spaceId}/environments/${config.environment}/entries?content_type=step&access_token=${config.accessToken}`;
      const response = await axiosInstance.get(url);
      setSteps(response.data.items);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  const fetchQuestions = async (questionId) => {
    try {
      const url = `spaces/${config.spaceId}/environments/${config.environment}/entries/${questionId}?access_token=${config.accessToken}`;
      const response = await axiosInstance.get(url);
      return response.data.fields;
    } catch (error) {
      console.error("Error fetching question data:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  useEffect(() => {
    if (steps.length > 0) {
      const loadQuestions = async () => {
        const questionsData = {};

        for (const step of steps) {
          const questionId = step.fields.questions.sys.id;
          const questionData = await fetchQuestions(questionId);
          if (questionData) {
            questionsData[step.sys.id] = questionData;
          }
        }

        setQuestionsByStep(questionsData);
        setLoading(false);
      };

      loadQuestions();
    }
  }, [steps]);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerChange = (stepId, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [stepId]: answer,
    }));
  };

  const calculateResults = () => {
    let correctCount = 0;

    steps.forEach((step) => {
      const question = questionsByStep[step.sys.id];
      const correctAnswer = question.correctAnswer;
      const userAnswer = userAnswers[step.sys.id];

      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });

    setCorrectAnswersCount(correctCount);
    setQuizFinished(true);
    setShowResultOnly(true);
  };

  const restartQuiz = () => {
    setQuizFinished(false);
    setCorrectAnswersCount(0);
    setUserAnswers({});
    setCurrentStep(0);
    setShowResultOnly(false);
  };

  const currentStepData = steps[currentStep];
  const currentQuestions = questionsByStep[currentStepData?.sys.id];

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h1>Quiz</h1>
      {!quizFinished && (
        <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      )}

      {quizFinished && showResultOnly && (
        <div>
          <h2>
            You're result: {correctAnswersCount}/{steps.length}
          </h2>
          <button onClick={restartQuiz}>Try again</button>{" "}
        </div>
      )}

      {!showResultOnly && (
        <div>
          {currentQuestions && (
            <div className="question-container">
              <h3>{currentQuestions.questionText}</h3>
              {currentQuestions.questionType === "multiple choice" ? (
                <div className={css.multiple}>
                  {currentQuestions.answers.split(",").map((answer, index) => (
                    <label className={css.label} key={index}>
                      <input
                        type="radio"
                        name={`question-${currentStep}`}
                        value={answer}
                        checked={
                          userAnswers[currentStepData.sys.id] === answer.trim()
                        }
                        onChange={() =>
                          handleAnswerChange(
                            currentStepData.sys.id,
                            answer.trim()
                          )
                        }
                      />
                      {answer.trim()}
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {!showResultOnly && (
        <div className={css.buttons}>
          <button onClick={goToPreviousStep} disabled={currentStep === 0}>
            Previous
          </button>
          {currentStep === steps.length - 1 ? (
            <button onClick={calculateResults}>Submit</button>
          ) : (
            <button
              onClick={goToNextStep}
              disabled={currentStep === steps.length - 1}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
