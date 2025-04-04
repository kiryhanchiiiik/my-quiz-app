import css from "./QuestionBlock.module.css";

const QuestionBlock = ({
  question,
  stepId,
  selectedAnswer,
  onChange,
  showValidation,
}) => {
  if (!question) return null;

  const renderQuestion = () => {
    switch (question.questionType) {
      case "multiple choice":
        return (
          <div className={css.multiple}>
            {question.answers.split(",").map((answer) => (
              <label className={css.label} key={answer}>
                <input
                  type="radio"
                  name={`question-${stepId}`}
                  value={answer}
                  checked={selectedAnswer === answer.trim()}
                  onChange={() => onChange(stepId, answer.trim())}
                />
                {answer.trim()}
              </label>
            ))}
          </div>
        );
      case "open-ended":
        return (
          <div>
            <textarea
              className={css.textarea}
              value={selectedAnswer || ""}
              onChange={(e) => onChange(stepId, e.target.value)}
              placeholder="Type your answer here"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h3>{question.questionText}</h3>
      {renderQuestion()}

      {showValidation && !selectedAnswer && (
        <p className={css.validationMessage}>
          Please choose or write an answer
        </p>
      )}
    </div>
  );
};

export default QuestionBlock;
