import { Edit, UserPlus, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import { toast } from "react-toastify";
import CreateUser from "./CreateUser";
import UpdateAccount from "./UpdateAccount";

const AccountTable = ({ refresh, openModal }) => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showUpdateAccountModal, setShowUpdateAccountModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.msisdn.includes(searchTerm) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

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

      {/* Results count */}
      <div className="text-sm text-gray-600 mb-2">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAccounts.length)} of {filteredAccounts.length} entries
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
        </div>
      ) : (
        <>
          <table className="w-full text-base text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase border-b bg-white">
              <tr>
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">Account Name</th>
                <th className="px-4 py-4">Description</th>
                <th className="px-4 py-4">Address</th>
                <th className="px-4 py-4">Phone Number</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((account, index) => (
                  <tr
                    key={account.accountId}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-green-600 whitespace-nowrap "
                    >
                      {indexOfFirstItem + index + 1}
                    </th>
                    <td className="px-3 py-3 max-w-[200px] truncate">{account.accountName}</td>
                    <td className="px-3 py-3 max-w-[200px] truncate">{account.description}</td>
                    <td className="px-3 py-3 max-w-[200px] truncate">{account.address}</td>
                    <td className="px-3 py-3">{account.msisdn}</td>
                    <td className="px-3 py-3 max-w-[200px] truncate">{account.email}</td>
                    <td className="px-3 py-3">
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
                    <td className="flex items-center px-3 py-3">
                      <a
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowUpdateAccountModal(true);
                        }}
                        className="font-medium text-green-600 hover:underline flex items-center cursor-pointer"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </a>
                      <a
                        onClick={() => handleCreateUser(account.accountId)}
                        className="font-medium text-yellowOrange hover:underline ms-3 flex items-center cursor-pointer"
                      >
                        <UserPlus className="w-3 h-3 mr-2" />
                        Create
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    No accounts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {filteredAccounts.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                        currentPage === 1
                          ? 'cursor-not-allowed bg-gray-50'
                          : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {getPageNumbers().map((pageNumber, index) => (
                      <button
                        key={index}
                        onClick={() => pageNumber !== '...' && handlePageChange(pageNumber)}
                        disabled={pageNumber === '...'}
                        aria-current="page"
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          pageNumber === currentPage
                            ? 'z-10 bg-green-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                            : pageNumber === '...'
                            ? 'text-gray-700 cursor-default'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                        currentPage === totalPages
                          ? 'cursor-not-allowed bg-gray-50'
                          : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
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
      
      {/* update account modal */}
      {showUpdateAccountModal && (
        <UpdateAccount
          isOpen={showUpdateAccountModal}
          onClose={() => setShowUpdateAccountModal(false)}
          account={selectedAccount}
          onAccountUpdate={fetchAccounts}
        />
      )}
    </div>
  );
};

export default AccountTable;