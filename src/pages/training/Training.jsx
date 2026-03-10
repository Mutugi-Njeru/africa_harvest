import { Download, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import TrainingsTable from "./TrainingsTable";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import { toast } from "react-toastify";

const Training = () => {
  const [trainings, setTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    setIsLoading(true);
    try {
      let url = BASE_REST_API_URL + "/training/v1/trainings/";
      const response = await axios.get(url);
      setTrainings(response.data.message.data)
    } catch (error) {
      console.error("Error fetching trainings:", error);
      toast.error("Failed to fetch trainings");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="pr-4 pl-3 relative">
      <div className="mt-3 mb-4">
        <div className="text-xl font-bold text-gray-600">Trainings</div>
      </div>
      <div className="flex justify-between items-center gap-3 mb-3">
        {/* Search input */}
        <div className="mb-2 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title, code, location, trainer..."
            className="w-96 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-saveButton focus:ring-1 focus:ring-gray-100 bg-transparent"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Show loading spinner or table based on isLoading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
        </div>
      ) : (
        <TrainingsTable 
          trainings={trainings} 
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
};

export default Training;