import { Pen, Plus } from "lucide-react";
const UserProfile = () => {
  return (
    <div className="pr-4 pl-3 relative">
      {/* header */}
      <div className="flex justify-between items-center mt-3 mb-5">
        <div className="text-xl font-bold text-gray-600">User Profile</div>
        <div className=" justify-end items-center">
          <button
            // onClick={() => {
            //   setIsAssignModalOpen(true);
            // }}
            className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white"
          >
            <Pen className="w-4 h-4" />
            <span className="ml-2 mr-2">Edit Profile</span>
          </button>
        </div>
      </div>
      {/* content */}
    </div>
  );
};

export default UserProfile;
