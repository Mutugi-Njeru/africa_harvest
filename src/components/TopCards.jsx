import React from "react";

const TopCards = () => {
  return (
    <div className="flex justify-between gap-4 p-5">
      {/* Card 1 */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-xl font-bold mb-2">Card 1</h3>
        <p className="text-gray-600">This is the content for card 1.</p>
      </div>

      {/* Card 2 */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Card 2</h3>
        <p className="text-gray-600">This is the content for card 2.</p>
      </div>

      {/* Card 3 */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Card 3</h3>
        <p className="text-gray-600">This is the content for card 3.</p>
      </div>

      {/* Card 4 */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Card 4</h3>
        <p className="text-gray-600">This is the content for card 4.</p>
      </div>
      {/* Card 4 */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Card 4</h3>
        <p className="text-gray-600">This is the content for card 4.</p>
      </div>
    </div>
  );
};

export default TopCards;
