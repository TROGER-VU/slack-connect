const HomePage = () => {
  const handleSlackLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/slack`;
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Connect with Slack</h1>
      <button
        onClick={handleSlackLogin}
        className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 transition"
      >
        Login with Slack
      </button>
    </div>
  );
};

export default HomePage;
