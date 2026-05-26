import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Header from "./components/Header";
import AchievementNotifier from "./components/AchievementNotifier";
import ProgressSyncBridge from "./components/ProgressSyncBridge";
import ScrollToTop from "./components/ScrollToTop";

import Landing from "./pages/Landing";
import Explore from "./pages/Explore";
import WorldMap from "./pages/WorldMap";
import Reading from "./pages/Reading";
import ChapterReading from "./pages/ChapterReading";
import Progress from "./pages/Progress";
import Author from "./pages/Author";
import Authors from "./pages/Authors";
import Works from "./pages/Works";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Epochs from "./pages/Epochs";
import RoutePage from "./pages/RoutePage";

function AuthRecoveryBridge() {
  const { authEvent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authEvent === "PASSWORD_RECOVERY") {
      navigate("/auth", { replace: true });
    }
  }, [authEvent, navigate]);

  return null;
}

function App() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <AuthRecoveryBridge />
      <ProgressSyncBridge />
      <AchievementNotifier />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/epochs" element={<Epochs />} />
        <Route path="/route/:routeId" element={<RoutePage />} />
        <Route path="/map" element={<WorldMap />} />
        <Route path="/works" element={<Works />} />
        <Route path="/reading/:id" element={<Reading />} />
        <Route path="/reading/:id/chapter/:chapterNumber" element={<ChapterReading />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/author/:name" element={<Author />} />
        <Route path="/authors" element={<Authors />} />
      </Routes>
    </>
  );
}

export default App;
