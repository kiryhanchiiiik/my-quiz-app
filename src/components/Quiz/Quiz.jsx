import { useState } from "react";
import { useQuizData } from "../../hooks/useQuizData";
import ProgressBar from "../ProgressBar/ProgressBar";
import QuestionBlock from "../QuestionBlock/QuestionBlock";
import css from "./Quiz.module.css";
import LoaderScreen from "../LoaderScreen/LoaderScreen";

const Quiz = () => {
  const { steps, questionsByStep, loading } = useQuizData();
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [showResultOnly, setShowResultOnly] = useState(false);
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const currentStepData = steps[currentStep];
  const currentQuestion = questionsByStep[currentStepData?.sys.id];

  const isStepValid = () => {
    return Boolean(userAnswers[currentStepData?.sys.id]);
  };

  const handleAnswerChange = (stepId, answer) => {
    setUserAnswers((prev) => ({ ...prev, [stepId]: answer }));
    setShowValidationMessage(false);
  };

  const goToNextStep = () => {
    if (!isStepValid()) {
      setShowValidationMessage(true);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => {
    setShowValidationMessage(false);
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const calculateResults = () => {
    if (!isStepValid()) {
      setShowValidationMessage(true);
      return;
    }

    let correctCount = 0;
    steps.forEach((step) => {
      const question = questionsByStep[step.sys.id];
      if (userAnswers[step.sys.id] === question.correctAnswer) {
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
    setShowValidationMessage(false);
  };

  if (loading) return <LoaderScreen />;

  return (
    <div>
      <h1>Quiz</h1>

      {!quizFinished && (
        <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      )}

      {quizFinished && showResultOnly ? (
        <div>
          <h2>
            Your result: {correctAnswersCount}/{steps.length}
          </h2>
          <button onClick={restartQuiz}>Try again</button>
        </div>
      ) : (
        <>
          <QuestionBlock
            question={currentQuestion}
            stepId={currentStepData?.sys.id}
            selectedAnswer={userAnswers[currentStepData?.sys.id]}
            onChange={handleAnswerChange}
            showValidation={showValidationMessage}
          />

          <div className={css.buttons}>
            <button onClick={goToPreviousStep} disabled={currentStep === 0}>
              Previous
            </button>
            {currentStep === steps.length - 1 ? (
              <button onClick={calculateResults}>Submit</button>
            ) : (
              <button onClick={goToNextStep}>Next</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
