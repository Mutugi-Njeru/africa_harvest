import { Plus } from "lucide-react";
import React from "react";

const Users = () => {
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
    // Add other products similarly
  ];

  return (
    <div className="pr-4 pl-3 relative">
      <div className="flex justify-end items-center">
        <button className="flex items-center cursor-pointer border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange text-white">
          <Plus className="w-4 h-4" />
          <span className="ml-2 mr-2">Create User</span>
        </button>
      </div>
      {/* table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-sm mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-white border-b  ">
            <tr>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3">Color</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Accessories</th>
              <th className="px-6 py-3">Available</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Weight</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {product.name}
                </th>
                <td className="px-6 py-4">{product.color}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">{product.accessories}</td>
                <td className="px-6 py-4">{product.available}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td className="px-6 py-4">{product.weight}</td>
                <td className="flex items-center px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </a>
                  <a
                    href="#"
                    className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                  >
                    Remove
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
