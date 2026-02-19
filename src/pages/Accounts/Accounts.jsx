import React, { useState } from "react";
import CreateAccount from "./CreateAccount";
import AccountTable from "./AccountTable";

const Accounts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleAccountCreated = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="pr-4 pl-3 relative">
      <div className={isModalOpen ? "pointer-events-none opacity-50" : ""}>
        <AccountTable refresh={refresh} openModal={openModal} />
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

export default Accounts;
