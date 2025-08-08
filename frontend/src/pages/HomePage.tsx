import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

const HomePage = () => {
  const [userConnected, setUserConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  // const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/me`, {
          method: "GET",
          credentials: "include", // This is crucial for sending cookies
        });

        if (response.ok) {
          setUserConnected(true);
          setUserName("User");
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleConnect = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/slack`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="flex flex-col items-center justify-center flex-1 text-center p-4">
        {!userConnected ? (
          <>
            <h1 className="text-3xl font-bold mb-4">Welcome to Slack Scheduler 🚀</h1>
            <p className="text-gray-600 mb-6">
              Connect with Slack to start scheduling messages with ease.
            </p>
            <button
              onClick={handleConnect}
              className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
            >
              Connect with Slack
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">Hello, {userName} 👋</h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/schedule"
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                📅 Schedule a Message
              </a>
              <a
                href="/scheduled"
                className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
              >
                📋 View Scheduled Messages
              </a>
            </div>
          </>
        )}
      </div>

      <footer className="bg-white border-t py-4 text-center text-sm text-gray-600">
        Built by Ayush —
        <a href="https://github.com/yourprofile" target="_blank" className="mx-2 underline">
          GitHub
        </a>
        |
        <a href="https://linkedin.com/in/yourprofile" target="_blank" className="mx-2 underline">
          LinkedIn
        </a>
      </footer>
    </div>
  );
};

export default HomePage;