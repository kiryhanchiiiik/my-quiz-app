import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Quiz from "./components/Quiz/Quiz";
import "./App.css";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </div>
  );
};

export default App;
