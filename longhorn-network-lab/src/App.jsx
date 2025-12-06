import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import StudentGraph from "./pages/StudentGraph";
import ReferralPath from "./pages/ReferralPath";
import ChatHistory from "./pages/ChatHistory";

export default function App() {
  return (
    <div>
      <NavBar />
      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student-graph" element={<StudentGraph />} />
          <Route path="/referral-path" element={<ReferralPath />} />
          <Route path="/chat-history" element={<ChatHistory />} />
        </Routes>
      </main>
    </div>
  );
}
