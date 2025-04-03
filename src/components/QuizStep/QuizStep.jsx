const QuizStep = ({ step, onNext, onPrevious }) => {
  return (
    <div>
      <h2>Step {step.id}</h2>
      {step.questions.map((question, index) => (
        <div key={index}>
          <p>{question.fields.questionText}</p>
          {question.fields.questionType === "multiple_choice" ? (
            <div>
              {question.fields.answers.map((answer, i) => (
                <label key={i}>
                  <input type="radio" name={question.sys.id} value={answer} />
                  {answer}
                </label>
              ))}
            </div>
          ) : (
            <input type="text" placeholder="Your answer" />
          )}
        </div>
      ))}
      <div>
        {step.id > 0 && <button onClick={onPrevious}>Previous</button>}
        {step.id < step.length - 1 ? (
          <button onClick={onNext}>Next</button>
        ) : (
          <button>Submit</button>
        )}
      </div>
    </div>
  );
};

export default QuizStep;
