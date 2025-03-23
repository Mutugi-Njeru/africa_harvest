import { Plus, Edit, UserPlus } from "lucide-react"; // Import the necessary icons
import React, { useState } from "react";
import CreateAccount from "./CreateAccount";
import AccountTable from "./AccountTable";

const SAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleAccountCreated = () => {
    setRefresh((prev) => !prev); // Toggle the refresh state to trigger re-fetch
  };

  return (
    <div className="pr-4 pl-3 relative">
      {/* Disable pointer events on the main content when the modal is open */}
      <div className={isModalOpen ? "pointer-events-none opacity-50" : ""}>
        <div className="flex justify-end items-center">
          <button
            onClick={openModal}
            className="flex items-center cursor-pointer border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange text-white"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Create Account</span>
          </button>
        </div>

        {/* table */}
        <AccountTable refresh={refresh} />
      </div>

      {/* Modal for Account Creation */}
      <CreateAccount
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        onAccountCreated={handleAccountCreated}
      />
    </div>
  );
};

export default SAdmin;
