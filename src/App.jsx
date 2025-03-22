import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Overview from "./pages/overview/Overview";
import SAdmin from "./pages/sAdmin/SAdmin";
import Login from "./pages/login/Login";
import { ToastContainer } from "react-toastify";
import Users from "./pages/users/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Dashboard />}>
          <Route path="/overview" element={<Overview />} />
          <Route path="/s-admin" element={<SAdmin />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: "white", // White background
          color: "#333", // Gray text
        }}
      />
    </BrowserRouter>
  );
}

export default App;
