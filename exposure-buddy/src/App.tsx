import React, { lazy, Suspense } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EvCalculator from "./components/EvCalculator";
import TopMenu from "./components/TopMenu";
const About = lazy(() => import("./About"));
const Home = lazy(() => import("./Home"));

const App: React.FC = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <TopMenu />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path="/exposure" element={<EvCalculator />} />
      </Routes>
    </Suspense>
  </Router>
);

export default App;
