import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import SendPage from "./pages/SendPage.tsx";
import SchedulePage from "./pages/SchedulePage.tsx";
import ScheduledPage from "./pages/ScheduledPage.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/send" element={<SendPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/scheduled" element={<ScheduledPage />} />
        {/* We’ll add /send, /schedule, /scheduled later */}
      </Routes>
    </Router>
  );
}

export default App;
