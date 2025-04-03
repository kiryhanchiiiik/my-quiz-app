import { Link } from "react-router-dom";
import css from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div>
      <h1>Hello, nice to see you in the Quiz App🤗</h1>
      <Link className={css.link} to="/quiz">
        Start Quiz
      </Link>
    </div>
  );
};

export default HomePage;
