import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const API_BASE_URL = "http://localhost:5000/api";

const AddReports = () => {
  const [formData, setFormData] = useState({
    programName: "",
    image: null,
    description: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch events from localStorage
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/events`);
        setEvents(res.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchEvents();
  }, []);

  // Filter programs based on search term
  const filteredPrograms = events.filter((program) =>
    program.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle program search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
    setFormData((prev) => ({ ...prev, programName: value }));
  };

  // Handle program selection
  const handleProgramSelect = (program) => {
    setFormData((prev) => ({ ...prev, programName: program.eventName }));
    setSearchTerm(program.eventName);
    setShowSuggestions(false);
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    setFormData((prev) => ({ ...prev, description: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.programName.trim()) {
      toast.error("Please select a program");
      return;
    }

    if (!formData.image) {
      toast.error("Please select an image");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    // Get existing reports from localStorage
    const existingReports = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    // Convert image to base64 for storage
    const reader = new FileReader();
    reader.onloadend = async () => {
      const newReportItems = {
        programName: formData.programName,
        image: reader.result, // base64 string
        description: formData.description,
      };

      try {
        await axios.post(`${API_BASE_URL}/reports`, newReportItems);

        // Reset form
        setFormData({
          programName: "",
          image: null,
          description: "",
        });
        setSearchTerm("");
        setImagePreview(null);

        toast.success("Report added successfully!");
      } catch (error) {
        console.error("Report error:", error);
        toast.error("Failed to submit report.");
      }
    };

    reader.onerror = () => {
      toast.error("Error reading image file");
    };

    reader.readAsDataURL(formData.image);
  };

  return (
    <div className="min-h-full w-full  p-6 overflow-y-auto font-out">
      <div className="max-w-5xl w-full mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Add Report</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-700/30 backdrop-blur-lg border border-white/10 rounded-xl p-8 shadow-xl w-full"
        >
          {/* Program Name Search */}
          <div className="mb-6 relative">
            <label className="block text-gray-300 mb-2 font-medium">
              Program Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(searchTerm.length > 0)}
              placeholder="Search for a program..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredPrograms.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredPrograms.map((program) => (
                  <div
                    key={program.id}
                    onClick={() => handleProgramSelect(program)}
                    className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-white border-b border-gray-700 last:border-b-0"
                  >
                    {program.eventName}
                  </div>
                ))}
              </div>
            )}

            {showSuggestions && filteredPrograms.length === 0 && searchTerm && (
              <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                <div className="px-4 py-3 text-gray-400">
                  No programs found
                </div>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-medium">
              Report Image <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col items-start gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                required
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs max-h-48 rounded-lg border border-gray-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Enter report description..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-fit px-3  bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReports;

