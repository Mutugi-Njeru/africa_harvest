import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Overview from "./pages/overview/Overview";
import SAdmin from "./pages/sAdmin/SAdmin";
import Login from "./pages/login/Login";
import { ToastContainer } from "react-toastify";
import Users from "./pages/users/Users";
import {
  ProtectedRoute,
  ProtectedAdminRoute,
  ProtectedRegionalCoordinatorRoute,
} from "./components/ProtectedRoute";
import UserProfile from "./pages/profile/UserProfile";
import Regions from "./pages/geographic/regions/Regions";
import Counties from "./pages/geographic/counties/Counties";
import Subcounties from "./pages/geographic/subcounties/Subcounties";
import Wards from "./pages/geographic/wards/Wards";
import Ward from "./pages/geographic/ward/Ward";
import Groups from "./pages/groups/Groups";
import Activities from "./pages/activities/Activities";
import Engagements from "./pages/engagements/Engagements";
import LoginExample from "./pages/login/LoginExample";
import BeneficiariesPage from "./pages/engagements/BeneficiariesPage ";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginExample />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Dashboard />}>
          <Route path="/overview" element={<Overview />} />
          <Route
            path="/accounts"
            element={
              <ProtectedRoute allowedRole="SUPER_ADMIN">
                <SAdmin /> {/* //only super admin */}
              </ProtectedRoute>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/activity" element={<Activities />} />
          <Route path="/engagements" element={<Engagements />} />
          <Route
            path="/engagements/:engagementId/beneficiaries"
            element={<BeneficiariesPage />}
          />

          <Route
            path="/regions"
            element={
              <ProtectedAdminRoute>
                <Regions /> {/*  only admins and super admin */}
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/counties" //only regional coordinators and admins
            element={
              <ProtectedRegionalCoordinatorRoute>
                <Counties />
              </ProtectedRegionalCoordinatorRoute>
            }
          />
          <Route path="/subcounties" element={<Subcounties />} />
          <Route path="/wards" element={<Wards />} />
          <Route path="/ward" element={<Ward />} />

          <Route path="/profile" element={<UserProfile />} />
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
