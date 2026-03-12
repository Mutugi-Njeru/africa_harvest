import { Download, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import CoursesTable from "./CoursesTable";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";
import CreateCourse from "./CreateCourse";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const accountId = localStorage.getItem("accountId");
   const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_REST_API_URL + `/training/v1/courses?accountId=${accountId}`);
      
      if (response.data.isSuccess) {
        setCourses(response.data.message);
      } else {
        toast.error('Failed to fetch courses');
      }
    } catch (err) {
      toast.error('Error fetching courses');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="pr-4 pl-3 relative">
      <div className="mt-3 mb-4">
        <div className="text-xl font-bold text-gray-600">Courses and Modules</div>
      </div>

      <div className="flex justify-between items-center gap-3 mb-3">
        {/* Search input */}
        <div className="mb-2 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title, code, or description..."
            className="w-96 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-saveButton focus:ring-1 focus:ring-gray-100 bg-transparent"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-end">
          <button
          onClick={() => setShowCreateCourseModal(true)}
            className="flex items-center border pl-3 pr-3 p-2 bg-createButton hover:bg-yellowOrange cursor-pointer text-white rounded-md"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Create Course</span>
          </button>
          <button
           
            className="flex items-center cursor-pointer pl-3 pr-3 p-2 text-black hover:bg-gray-100"
          >
            <Download className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* table */}
      <CoursesTable
        courses={courses}
        loading={loading}
        searchTerm={searchTerm}
        onCourseUpdated={fetchCourses}
      />
      <CreateCourse
        isOpen={showCreateCourseModal}
        onClose={() => setShowCreateCourseModal(false)}
        onCourseCreated={fetchCourses}
      />
    </div>
  );
};

export default Courses;