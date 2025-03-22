import { Plus, Edit, UserPlus } from "lucide-react"; // Import the necessary icons
import React, { useState } from "react";
import CreateAccount from "./CreateAccount";

const SAdmin = () => {
  const [status, setStatus] = useState(false); // State to manage the toggle status
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const products = [
    {
      id: 1,
      name: 'Apple MacBook Pro 17"',
      color: "Silver",
      category: "Laptop",
      accessories: "Yes",
      available: "Yes",
      price: "$2999",
      weight: "3.0 lb.",
    },
    {
      id: 2,
      name: 'Dell XPS 15"',
      color: "Black",
      category: "Laptop",
      accessories: "No",
      available: "Yes",
      price: "$1999",
      weight: "4.0 lb.",
    },
  ];

  const toggleStatus = () => {
    setStatus(!status); // Toggle the status
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

        <div className="relative shadow-md sm:rounded-lg mt-3">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase border-b bg-white">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Account Name</th>
                <th className="px-6 py-3">Color</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Accessories</th>
                <th className="px-6 py-3">Available</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {index + 1}
                  </th>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4">{product.color}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.accessories}</td>
                  <td className="px-6 py-4">{product.available}</td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={toggleStatus}
                      className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${
                        status ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          status ? "translate-x-4" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </td>
                  <td className="flex items-center px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:underline flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </a>
                    <a
                      href="#"
                      className="font-medium text-yellow-600 hover:underline ms-3 flex items-center"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Admin
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Account Creation */}
      <CreateAccount isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default SAdmin;
