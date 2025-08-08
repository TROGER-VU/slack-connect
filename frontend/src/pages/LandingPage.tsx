"use client";
import { useEffect } from "react";
import { CheckCircle, Users, Shield, MessageSquare, Clock } from "lucide-react";

import type { ReactNode, ButtonHTMLAttributes } from "react";

const Button = ({
  children,
  className = "",
  ...props
}: {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`px-10 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}
  >
    {children}
  </button>
);

// Card
const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-3xl border border-gray-700 bg-gray-800 p-8 shadow-md hover:shadow-xl transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

// Footer
const Footer = () => (
  <footer className="text-sm text-center text-gray-400 py-8 border-t border-gray-700 mt-20">
    Built by Ayush — 
    <a
      href="https://github.com/yourprofile"
      target="_blank"
      className="text-purple-400 mx-2 underline hover:text-purple-200"
    >
      GitHub
    </a>
    |
    <a
      href="https://linkedin.com/in/yourprofile"
      target="_blank"
      className="text-purple-400 mx-2 underline hover:text-purple-200"
    >
      LinkedIn
    </a>
  </footer>
);


const LandingPage = () => {
  const quickFeatures = [
    "Secure Slack OAuth Connection",
    "Choose channels to post in",
    "Send or schedule Slack messages",
    "Manage and edit scheduled messages",
  ];

  const detailedFeatures = [
    {
      icon: <Shield className="w-10 h-10 text-purple-400" />,
      title: "Secure OAuth",
      description: "OAuth2-based Slack login with token refresh & secure storage.",
    },
    {
      icon: <Users className="w-10 h-10 text-indigo-400" />,
      title: "Channel Picker",
      description: "Pick a Slack channel to send or schedule your message.",
    },
    {
      icon: <MessageSquare className="w-10 h-10 text-purple-400" />,
      title: "Instant & Scheduled",
      description: "Send now or schedule for later — all in one click.",
    },
    {
      icon: <Clock className="w-10 h-10 text-indigo-400" />,
      title: "Manage Queue",
      description: "Edit or delete scheduled messages anytime.",
    },
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/health`);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg px-4 py-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            
            <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent tracking-tighter">
              Slack Connect
            </span>
          </div>
          <a
            href="https://github.com/ayushxyz/slack-pulse"
            className="text-sm font-semibold text-purple-400 hover:underline hover:text-purple-200"
            target="_blank"
          >
            GitHub ↗
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-4 text-center">
        <h1 className="text-5xl md:text-5xl font-extrabold text-gray-100 mb-6 leading-tight max-w-4xl mx-auto">
          Automate and Schedule Your <span className="bg-gradient-to-r from-purple-500 to-indigo-400 text-transparent bg-clip-text">Team's Communication</span>
        </h1>
        <p className="text-xl md:text-xl text-gray-300 max-w-4xl mx-auto mb-12">
          Slack Connect is the simplest way to draft, time, and manage your Slack messages,
          ensuring your team stays aligned and productive.
        </p>

        <a href={`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/slack`}>
          <Button className="shadow-purple-400/50">
            🚀 Connect with Slack
          </Button>
        </a>

        {/* Quick Feature Bullets */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          {quickFeatures.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-4 rounded-full bg-gray-800 shadow-lg">
              <CheckCircle className="text-green-500 w-6 h-6" />
              <span className="text-lg text-gray-200 font-medium">{feature}</span>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="mt-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {detailedFeatures.map((feat, i) => (
            <Card key={i} className="text-center">
              <div className="mb-4 flex justify-center">{feat.icon}</div>
              <h3 className="font-bold text-xl mb-2 text-gray-100">{feat.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feat.description}</p>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;