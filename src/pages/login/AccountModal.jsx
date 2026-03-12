import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import {
  accountId,
  accountName,
  BASE_REST_API_URL,
} from "../../service/AuthService";
import axios from "axios";
import CustomFiltersStyles from "../../styles/CustomFiltersStyles";

const AccountModal = ({ showAccountModal, setShowAccountModal }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      if (showAccountModal) {
        try {
          const response = await axios.get(
            BASE_REST_API_URL + "accounts/v1/all",
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

  const handleAccountSelect = (selectedOption) => {
    if (selectedOption) {
      setSelectedAccount(selectedOption);
      setShowAccountModal(false);
      toast.success("Login successful");
      accountId(selectedOption.value);
      accountName(selectedOption.label);
      navigate("/overview");
    }
  };

  return (
    <div>
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:w-1/3 xl:w-1/4 mx-auto">
            <h2 className="text-lg sm:text-xl md:text-xl font-semibold mb-3 sm:mb-4 text-center sm:text-left">
              Select Account
            </h2>

            <div className="w-full">
              <Select
                options={accountOptions}
                value={selectedAccount}
                onChange={handleAccountSelect}
                placeholder="Select account to continue"
                className="mb-3 sm:mb-4 text-sm sm:text-base"
            
                styles={CustomFiltersStyles}
               
              />
            </div>

            <div className="flex justify-end mt-4 sm:mt-6">
              <button
                onClick={() => setShowAccountModal(false)}
                className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-saveButton rounded-md bg-cancelButton text-saveButton hover:bg-gray-50 min-w-[100px] w-full sm:w-auto transition-colors duration-200 text-sm sm:text-base"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountModal;