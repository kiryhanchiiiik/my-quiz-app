import { useState } from "react";
import { ClipLoader } from "react-spinners";

const LoaderScreen = () => {
  let [color, setColor] = useState("#ffffff");
  return (
    <div>
      <ClipLoader
        color={color}
        aria-label="Loading Spinner"
        data-testid="loader"
        size={80}
      />
    </div>
  );
};

export default LoaderScreen;
