import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, BookOpenText, PlusCircle } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const StudyPlans = () => {
  const [plans, setPlans] = useState([]);
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");

  const addPlan = () => {
    if (!topic || !date || !duration) return;
    setPlans([...plans, { topic, date, duration }]);
    setTopic("");
    setDate("");
    setDuration("");
  };

  const removePlan = (index) => {
    const newPlans = [...plans];
    newPlans.splice(index, 1);
    setPlans(newPlans);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-800 overflow-y-auto">
      <NavBar/>

      {/* Hero Section */}
      <section className="text-center py-16 px-6 bg-gradient-to-br from-white to-blue-100">
        <h1 className="text-5xl font-extrabold leading-tight max-w-3xl mx-auto">
          Plan, Track, and Stay Consistent with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Smarter Study Routines
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
          Create personalized study plans and sync them directly to your Google Calendar.
        </p>
      </section>

      {/* Add Plan Form */}
      <section className="py-10 px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpenText /> New Study Task
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Topic"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <input
              type="date"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="text"
              placeholder="Duration (e.g. 2 hrs)"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
            onClick={addPlan}
          >
            <PlusCircle size={18} /> Add Plan
          </button>
        </div>

        {/* Plan Display */}
        {plans.length > 0 && (
          <div className="space-y-4">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-bold">📘 {plan.topic}</h3>
                  <p className="text-sm text-gray-600">🗓 {plan.date}</p>
                  <p className="text-sm text-gray-600">⏱ {plan.duration}</p>
                </div>
                <button
                  onClick={() => removePlan(index)}
                  className="text-red-500 font-semibold hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {plans.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-10">
            No study plans yet. Add one above to get started! 💡
          </p>
        )}
      </section>

      {/* Google Calendar Embed */}
      <section className="px-6 py-12 bg-white">
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <CalendarDays /> Synced Calendar
        </h2>
        <div className="flex justify-center">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=en.indian%23holiday%40group.v.calendar.google.com&ctz=Asia%2FCalcutta"
            style={{ border: 0 }}
            width="1000"
            height="600"
            frameBorder="0"
            scrolling="no"
            title="Google Calendar"
          ></iframe>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default StudyPlans;
