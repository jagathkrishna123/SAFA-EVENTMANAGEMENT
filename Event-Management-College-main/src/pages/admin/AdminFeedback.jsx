import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const STORAGE_KEY = "user_ratings";

const AdminFeedback = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEvent, setFilterEvent] = useState("all");

  useEffect(() => {
    loadRatings();
    // Refresh ratings when storage changes
    window.addEventListener("storage", loadRatings);
    return () => window.removeEventListener("storage", loadRatings);
  }, []);

  const loadRatings = () => {
    try {
      const storedRatings = localStorage.getItem(STORAGE_KEY);
      if (storedRatings) {
        const parsedRatings = JSON.parse(storedRatings);
        // Sort by creation date (newest first)
        const sortedRatings = parsedRatings.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRatings(sortedRatings);
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueEvents = () => {
    const events = [...new Set(ratings.map(rating => rating.eventName))];
    return events;
  };

  const filteredRatings = filterEvent === "all"
    ? ratings
    : ratings.filter(rating => rating.eventName === filterEvent);

  const getAverageRating = (eventName) => {
    const eventRatings = ratings.filter(r => r.eventName === eventName);
    if (eventRatings.length === 0) return 0;
    const sum = eventRatings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / eventRatings.length).toFixed(1);
  };

  const getRatingStats = () => {
    const totalRatings = ratings.length;
    const avgRating = totalRatings > 0
      ? (ratings.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(1)
      : 0;
    const uniqueEvents = getUniqueEvents().length;

    return { totalRatings, avgRating, uniqueEvents };
  };

  const StarRating = ({ value }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= value ? "text-yellow-400" : "text-gray-400"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const stats = getRatingStats();

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-10 bg-gray-900 overflow-y-auto flex items-center justify-center">
        <div className="text-white text-xl">Loading ratings...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-10  overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Event Ratings & Feedback</h1>
            <p className="text-gray-400">Admin view of all user ratings and feedback</p>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 text-center"
          >
            <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalRatings}</div>
            <div className="text-gray-300">Total Ratings</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 text-center"
          >
            <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.avgRating}★</div>
            <div className="text-gray-300">Average Rating</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 text-center"
          >
            <div className="text-3xl font-bold text-green-400 mb-2">{stats.uniqueEvents}</div>
            <div className="text-gray-300">Events Rated</div>
          </motion.div>
        </div>

        {/* Filter */}
        {getUniqueEvents().length > 1 && (
          <div className="mb-6">
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Events</option>
              {getUniqueEvents().map(eventName => (
                <option key={eventName} value={eventName}>
                  {eventName} (Avg: {getAverageRating(eventName)}★)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Event Statistics */}
        {filterEvent === "all" && getUniqueEvents().length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {getUniqueEvents().map(eventName => {
              const eventRatings = ratings.filter(r => r.eventName === eventName);
              const avgRating = getAverageRating(eventName);
              const ratingCount = eventRatings.length;

              // Calculate rating distribution
              const distribution = [0, 0, 0, 0, 0];
              eventRatings.forEach(r => distribution[r.rating - 1]++);
              const maxCount = Math.max(...distribution);

              return (
                <motion.div
                  key={eventName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{eventName}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <StarRating value={Math.round(avgRating)} />
                    <span className="text-yellow-400 font-bold text-lg">{avgRating}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    {ratingCount} rating{ratingCount !== 1 ? 's' : ''}
                  </p>

                  {/* Rating Distribution */}
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs mb-2">Rating Distribution:</p>
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3">{star}★</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: maxCount > 0 ? `${(distribution[star - 1] / maxCount) * 100}%` : '0%'
                            }}
                          />
                        </div>
                        <span className="w-6 text-right">{distribution[star - 1]}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Ratings List */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            {filterEvent === "all" ? "All Ratings & Feedback" : `${filterEvent} Ratings`}
          </h2>

          {filteredRatings.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-700/50 rounded-xl p-12 border border-gray-600">
                <svg
                  className="mx-auto h-16 w-16 text-gray-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <h3 className="text-2xl font-semibold text-gray-300 mb-2">
                  No Ratings Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  {filterEvent === "all"
                    ? "Ratings will appear here once users rate events"
                    : `No ratings for ${filterEvent} yet`
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRatings.map((rating, index) => (
                <motion.div
                  key={rating.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-gray-700/50 rounded-lg p-6 border border-gray-600"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {rating.eventName}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        User ID: {rating.userId}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(rating.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <StarRating value={rating.rating} />
                      <p className="text-yellow-400 font-bold text-2xl mt-1">{rating.rating}/5</p>
                    </div>
                  </div>

                  {/* Review */}
                  {rating.review && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-blue-500">
                      <p className="text-gray-300 italic">"{rating.review}"</p>
                    </div>
                  )}

                  {/* Admin Actions */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span>Rating ID: {rating.id.slice(0, 8)}...</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition">
                        View User
                      </button>
                      <button className="text-red-400 hover:text-red-300 text-sm font-medium transition">
                        Flag
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Export Options */}
        {/* {ratings.length > 0 && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Export Options</h3>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                Export to CSV
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
                Generate Report
              </button>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition">
                Send to Management
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AdminFeedback;


