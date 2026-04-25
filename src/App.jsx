import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";

import Landing from "./pages/Landing";
import Explore from "./pages/Explore";
import WorldMap from "./pages/WorldMap";
import Reading from "./pages/Reading";
import ChapterReading from "./pages/ChapterReading";
import Progress from "./pages/Progress";
import Author from "./pages/Author";
import Authors from "./pages/Authors";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/map" element={<WorldMap />} />
        <Route path="/reading/:id" element={<Reading />} />
        <Route path="/reading/:id/chapter/:chapterNumber" element={<ChapterReading />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/author/:name" element={<Author />} />
        <Route path="/authors" element={<Authors />} />
      </Routes>
    </>
  );
}

export default App;
