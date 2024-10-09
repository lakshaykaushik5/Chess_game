// import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./screens/Landing";
import { Game } from "./screens/Game";
import { SignUp } from "./screens/SignUp";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <div className="h-screen bg-neutral-800">
        <BrowserRouter>
          <Routes>
            <Route path="/Landing" element={<Landing />} />
            <Route path="/Game" element={<Game />} />
            <Route path="/" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
