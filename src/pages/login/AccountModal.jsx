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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/4">
            <h2 className="text-xl font-bold mb-4">
              Please Select an Account to Continue
            </h2>
            <Select
              options={accountOptions}
              value={selectedAccount}
              onChange={handleAccountChange}
              placeholder="Select an account..."
              className="mb-4"
            />
            <button
              onClick={() => setShowAccountModal(false)}
              className="mt-4 bg-red-500 hover:bg-red-800 text-white w-1/2 py-2 "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountModal;
