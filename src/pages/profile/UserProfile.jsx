import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdSecurity } from "react-icons/md";

const UserProfile = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const user = {
    firstname: "John",
    lastname: "Doe",
    phone: "254712345678",
    email: "john.doe@example.com",
    username: "johndoe",
  };

  const avatar =
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400";

  return <div>h</div>;
};

export default UserProfile;
