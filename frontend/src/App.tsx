import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScheduledPage from "./pages/ScheduledPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import MessageComposer from "./pages/MessageComposer.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/scheduled" element={<ScheduledPage />} />
        <Route path="/message" element={<MessageComposer />} />
      </Routes>
    </Router>
  );
}

export default App;
