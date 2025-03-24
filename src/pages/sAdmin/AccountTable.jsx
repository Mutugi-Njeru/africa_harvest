import { Edit, UserPlus, Search, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import { toast } from "react-toastify";
import CreateUser from "./CreateUser"; // Import the new modal component

const AccountTable = ({ refresh, openModal }) => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(BASE_REST_API_URL + "accounts/v1/all");
      setAccounts(response.data.message);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = (accountId) => {
    setSelectedAccountId(accountId);
    setShowCreateUserModal(true);
  };

  const activateAccount = async (userId) => {
    try {
      const response = await axios.put(
        BASE_REST_API_URL + "/accounts/v1/activate/" + userId
      );
      toast.success(response.data.message);
      fetchAccounts();
    } catch (error) {
      console.error("Error activating account:", error);
      toast.error("Cannot activate account");
    }
  };

  const deactivateAccount = async (userId) => {
    try {
      const response = await axios.put(
        BASE_REST_API_URL + "/accounts/v1/deactivate/" + userId
      );
      toast.success(response.data.message);
      fetchAccounts();
    } catch (error) {
      console.error("Error deactivating account:", error);
      toast.error("Cannot deactivate account");
    }
  };

  const handleStatusToggle = (account) => {
    setSelectedAccount(account);
    if (account.isActive) {
      setShowDeactivateModal(true);
    } else {
      setShowActivateModal(true);
    }
  };

  const handleConfirmActivation = () => {
    if (selectedAccount) {
      activateAccount(selectedAccount.accountId);
      setShowActivateModal(false);
      setSelectedAccount(null);
    }
  };

  const handleConfirmDeactivation = () => {
    if (selectedAccount) {
      deactivateAccount(selectedAccount.accountId);
      setShowDeactivateModal(false);
      setSelectedAccount(null);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [refresh]);

  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.msisdn.includes(searchTerm) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="ml-2 mt-3 text-xl font-bold text-gray-600">Accounts</div>
      <div className="flex justify-between items-center mb-2 mt-3">
        <div className="mb-2 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by account name, phone, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-96 px-4 py-2 pl-10 focus:outline-none border-0 border-b-2 border-gray-300 focus:border-green-500 bg-transparent"
          />
        </div>
        <div className="flex justify-end items-center">
          <button
            onClick={openModal}
            className="flex items-center cursor-pointer border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange text-white"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Create Account</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
        </div>
      ) : (
        <table className="w-full text-base text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase border-b bg-white">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Account Name</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account, index) => (
              <tr
                key={account.accountId}
                className="bg-white border-b hover:bg-gray-50"
              >
                <th
                  scope="row"
                  className="px-6 py-3 font-medium text-green-600 whitespace-nowrap "
                >
                  {index + 1}
                </th>
                <td className="px-6 py-3">{account.accountName}</td>
                <td className="px-6 py-3">{account.description}</td>
                <td className="px-6 py-3">{account.address}</td>
                <td className="px-6 py-3">{account.msisdn}</td>
                <td className="px-6 py-3">{account.email}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleStatusToggle(account)}
                    className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${
                      account.isActive ? "bg-green-500" : "bg-yellowOrange"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        account.isActive ? "translate-x-4" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </td>
                <td className="flex items-center px-6 py-3">
                  <a className="font-medium text-green-600 hover:underline flex items-center cursor-pointer">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </a>
                  <a
                    onClick={() => handleCreateUser(account.accountId)}
                    className="font-medium text-yellowOrange hover:underline ms-3 flex items-center cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create User
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Activation Confirmation Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Activation</h2>
            <p>Are you sure you want to activate this account?</p>
            <div className="mt-6 flex">
              <button
                onClick={() => setShowActivateModal(false)}
                className="w-1/2 px-4 py-2 bg-red-400 hover:bg-red-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmActivation}
                className="w-1/2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white"
              >
                Yes, Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivation Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deactivation</h2>
            <p>Are you sure you want to deactivate this account?</p>
            <div className="mt-6 flex">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="w-1/2 px-4 py-2 bg-red-400 hover:bg-red-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeactivation}
                className="w-1/2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white"
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      <CreateUser
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        accountId={selectedAccountId}
      />
    </div>
  );
};

export default AccountTable;
