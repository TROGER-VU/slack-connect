import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Send, Clock, List, ArrowLeft } from "lucide-react";

// Define a type for the channel object
type Channel = {
  id: string;
  name: string;
};

const buttonBaseClass =
  "flex items-center justify-center space-x-2 px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1";
const primaryButtonClass =
  "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl";
const secondaryButtonClass =
  "bg-gray-700 text-white shadow-xl hover:shadow-2xl";

const MessageComposer = () => {
  const [text, setText] = useState("");
  const [channelId, setChannelId] = useState("");
  const [sendTime, setSendTime] = useState<Date | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
const [searchParams] = useSearchParams();

const team_id = searchParams.get("team_id");
const user_id = searchParams.get("user_id");
const channelsFromUrl = searchParams.get("channels");

useEffect(() => {
  if (!team_id || !user_id) {
    alert("❌ Missing Slack credentials in URL.");
    navigate("/");
    return;
  }

  if (channelsFromUrl) {
    try {
      const parsed = JSON.parse(decodeURIComponent(channelsFromUrl));
      setChannels(parsed || []);
    } catch (err) {
      console.error("Failed to parse channels from URL", err);
    }
  }
}, [team_id, user_id, channelsFromUrl, navigate]);

  const handleSend = async () => {
    if (!text || !channelId) {
      alert("❌ Message and channel are required.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/message/send`,
        {
          team_id,
          user_id,
          channel_id: channelId,
          text,
        }
      );

      alert("✅ Message sent successfully!");
      setText("");
      setChannelId("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!text || !channelId || !sendTime || sendTime < new Date()) {
      alert("❌ Please fill all fields and select a valid future time.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/message/schedule`,
        {
          team_id,
          user_id,
          channel_id: channelId,
          text,
          send_time: sendTime.toISOString(),
        }
      );

      alert("✅ Message scheduled!");
      setText("");
      setChannelId("");
      setSendTime(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to schedule message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans">
      <div className="max-w-xl w-full mx-auto p-8 shadow-lg rounded-3xl bg-gray-800 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-extrabold text-white">
            Message Composer
          </h1>
          <div></div>
        </div>

        {/* Channel Selector */}
        <div className="mb-6">
          <label
            htmlFor="channelId"
            className="block text-sm font-semibold text-gray-400 mb-2"
          >
            Select Slack Channel
          </label>
          <select
            id="channelId"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select a channel</option>
            {channels.map((ch: Channel) => (
              <option key={ch.id} value={ch.id}>
                #{ch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Message Box */}
        <div className="mb-6">
          <label
            htmlFor="messageText"
            className="block text-sm font-semibold text-gray-400 mb-2"
          >
            Message
          </label>
          <textarea
            id="messageText"
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={5}
            placeholder="Type your message here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Date Picker */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-400 mb-2">
            Schedule a time (Optional)
          </label>
          <DatePicker
            selected={sendTime}
            onChange={(date) => setSendTime(date)}
            showTimeSelect
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            minDate={new Date()}
            placeholderText="Select a future date and time"
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            wrapperClassName="w-full"
          />
        </div>

        {/* Send & Schedule Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleSend}
            disabled={loading}
            className={`${buttonBaseClass} ${primaryButtonClass} flex-1`}
          >
            <Send className="w-5 h-5" />
            <span>{loading ? "Sending..." : "Send Now"}</span>
          </button>
          <button
            onClick={handleSchedule}
            disabled={loading || !sendTime}
            className={`${buttonBaseClass} ${secondaryButtonClass} flex-1`}
          >
            <Clock className="w-5 h-5" />
            <span>{loading ? "Scheduling..." : "Schedule"}</span>
          </button>
        </div>

        {/* View Scheduled Button */}
        <button
          onClick={() => {
            const newSearchParams = new URLSearchParams();
            if (team_id) {
              newSearchParams.set("team_id", team_id);
            }
            if (user_id) {
              newSearchParams.set("user_id", user_id);
            }
            navigate(`/scheduled?${newSearchParams.toString()}`);
          }}
          className="w-full mt-4 flex items-center justify-center space-x-2 px-6 py-3 rounded-full font-bold text-lg text-purple-400 bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <List className="w-5 h-5" />
          <span>View Scheduled Messages</span>
        </button>
      </div>
    </div>
  );
};

export default MessageComposer;
