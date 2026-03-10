import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";

const UpdateCourse = ({ isOpen, onClose, course, onCourseUpdated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const accountId = localStorage.getItem("accountId");

  const [formData, setFormData] = useState({
    accountId: "",
    title: "",
    description: "",
    durationHours: "",
    isActive: true,
  });

  useEffect(() => {
    if (course) {
      setFormData({
        accountId: accountId || "",
        title: course.title || "",
        description: course.description || "",
        durationHours: course.durationHours || "",
        isActive: course.isActive !== undefined ? course.isActive : true,
      });
    }
  }, [course, accountId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${BASE_REST_API_URL}/training/v1/courses/${course.courseId}`,
        {
          accountId: parseInt(accountId),
          title: formData.title,
          description: formData.description,
          durationHours: parseInt(formData.durationHours),
          isActive: formData.isActive,
        },
      );
      toast.success("course updated successfully");
      onCourseUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 shadow-lg w-[600px] rounded-lg">
        <h2 className="text-lg font-semibold mb-4">
          Update Course: {course?.title}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter course title"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100 rounded-md"
              required
            />
          </div>

          {/* Duration Hours */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Hours)
            </label>
            <input
              type="number"
              name="durationHours"
              value={formData.durationHours}
              onChange={handleChange}
              placeholder="Enter duration in hours"
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100 rounded-md"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100 rounded-md"
              rows="4"
              placeholder="Enter course description"
              required
            />
          </div>

          {/* Status Toggle */}
          <div className="mb-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-saveButton focus:ring-saveButton border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Active Status
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              {formData.isActive
                ? "Course status is active"
                : "Course status is inactive"}
            </p>
          </div>

          {/* Hidden accountId field for reference (optional) */}
          <input type="hidden" name="accountId" value={accountId} />

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-saveButton rounded-md bg-cancelButton text-saveButton hover:bg-gray-50 min-w-[100px]"
            >
              <X size={20} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-md text-white min-w-[100px] ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-saveButton hover:bg-yellowOrange"
              }`}
            >
              {isLoading ? (
                "Updating..."
              ) : (
                <>
                  <Check size={20} />
                  Update
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourse;
