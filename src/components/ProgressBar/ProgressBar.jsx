import css from "./ProgressBar.module.css";
const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={css.container}>
      <progress className={css.progress} value={progress} max={100}></progress>
      <span>
        {currentStep + 1} / {totalSteps}
      </span>
    </div>
  );
};

export default ProgressBar;
