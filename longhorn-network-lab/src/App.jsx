import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import StudentGraph from "./pages/StudentGraph";
import ReferralPath from "./pages/ReferralPath";
import ChatHistory from "./pages/ChatHistory";

export default function App() {
  return (
    <div style = {{ backgroundColor: "#16697A", minHeight: "100vh", width: "100vw"}}>
      <NavBar />
      <main style={{ padding: "20px"}}>
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
