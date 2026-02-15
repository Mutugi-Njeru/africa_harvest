import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import {
  accountId,
  accountName,
  BASE_REST_API_URL,
} from "../../service/AuthService";
import axios from "axios";

const AccountModal = ({ showAccountModal, setShowAccountModal }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      if (showAccountModal) {
        try {
          const response = await axios.get(
            BASE_REST_API_URL + "accounts/v1/all"
          );
          setAccounts(response.data.message);
        } catch (error) {
          console.error("Error fetching accounts:", error);
          toast.error("Failed to fetch accounts");
        }
      }
    };

    fetchAccounts();
  }, [showAccountModal]);

  const accountOptions = Array.isArray(accounts)
    ? accounts.map((account) => ({
        value: account.accountId,
        label: account.accountName,
      }))
    : [];

  const handleAccountChange = (selectedOption) => {
    setSelectedAccount(selectedOption);
    setShowAccountModal(false);
    toast.success("Login successful");
    accountId(selectedOption.value);
    accountName(selectedOption.label);
    navigate("/overview");
  };

  return (
    <div>
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:w-1/3 xl:w-1/4 mx-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-center sm:text-left">
              Please Select an Account to Continue
            </h2>
            
            <div className="w-full">
              <Select
                options={accountOptions}
                value={selectedAccount}
                onChange={handleAccountChange}
                placeholder="Select an account..."
                className="mb-3 sm:mb-4 text-sm sm:text-base"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '42px',
                    '@media (min-width: 640px)': {
                      minHeight: '45px',
                    }
                  }),
                  menu: (base) => ({
                    ...base,
                    fontSize: '14px',
                    '@media (min-width: 640px)': {
                      fontSize: '16px',
                    }
                  })
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
              <button
                onClick={() => setShowAccountModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg w-full sm:w-1/2 order-2 sm:order-1 transition-colors duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedAccount && handleAccountChange(selectedAccount)}
                disabled={!selectedAccount}
                className={`bg-lime-500 hover:bg-lime-700 text-white font-semibold py-2 px-4 rounded-lg w-full sm:w-1/2 order-1 sm:order-2 transition-colors duration-200 text-sm sm:text-base ${
                  !selectedAccount ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountModal;