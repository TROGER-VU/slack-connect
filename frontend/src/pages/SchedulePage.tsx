import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SchedulePage = () => {
  const [text, setText] = useState("");
  const [channelId, setChannelId] = useState("");
  const [sendTime, setSendTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    if (!sendTime || sendTime < new Date()) {
      alert("❌ Please choose a valid future time");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/message/schedule`,
        {
          team_id: localStorage.getItem("team_id") || "T06EF9YEQAK",
          user_id: localStorage.getItem("user_id") || "U06EP79DCHL",
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
    <div className="max-w-xl mx-auto mt-16 p-6 shadow-lg rounded-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">Schedule a Slack Message</h1>
      <input
        className="w-full p-2 border rounded mb-4"
        placeholder="Channel ID"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
      />
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={4}
        placeholder="Message text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Send at:</label>
        <DatePicker
          selected={sendTime}
          onChange={(date) => setSendTime(date)}
          showTimeSelect
          timeIntervals={15}
          dateFormat="yyyy-MM-dd HH:mm"
          minDate={new Date()}
          className="p-2 border rounded w-full"
        />
      </div>
      <button
        onClick={handleSchedule}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Scheduling..." : "Schedule Message"}
      </button>
    </div>
  );
};

export default SchedulePage;
