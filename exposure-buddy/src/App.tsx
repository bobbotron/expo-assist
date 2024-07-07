import React, { lazy, Suspense } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EvCalculator from "./components/EvCalculator";
const About = lazy(() => import("./About"));
const Home = lazy(() => import("./Home"));

const App: React.FC = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      {/* <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav> */}
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path="/exposure" element={<EvCalculator />} />
      </Routes>
    </Suspense>
  </Router>
);

export default App;
