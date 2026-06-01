import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Header from "./components/Header";
import AchievementNotifier from "./components/AchievementNotifier";
import ProgressSyncBridge from "./components/ProgressSyncBridge";
import ScrollToTop from "./components/ScrollToTop";

const Landing = lazy(() => import("./pages/Landing"));
const Explore = lazy(() => import("./pages/Explore"));
const WorldMap = lazy(() => import("./pages/WorldMap"));
const Reading = lazy(() => import("./pages/Reading"));
const ChapterReading = lazy(() => import("./pages/ChapterReading"));
const Progress = lazy(() => import("./pages/Progress"));
const Author = lazy(() => import("./pages/Author"));
const Authors = lazy(() => import("./pages/Authors"));
const Works = lazy(() => import("./pages/Works"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const About = lazy(() => import("./pages/About"));
const Epochs = lazy(() => import("./pages/Epochs"));
const RoutePage = lazy(() => import("./pages/RoutePage"));

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

      <Suspense fallback={<main className="route-loading" aria-busy="true" />}>
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
      </Suspense>
    </>
  );
}

export default App;
