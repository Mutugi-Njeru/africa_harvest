import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Overview from "./pages/overview/Overview";
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
import { isUserLoggedIn, logout } from "./service/AuthService";
import { useEffect } from "react";
import Training from "./pages/training/Training";
import Accounts from "./pages/Accounts/Accounts";
import CreateTrainer from "./pages/training/CreateTrainer";
import Trainers from "./pages/trainers/Trainers";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        logout();
        window.location.href = "/";
      }
    }
  }, []);

  function AuthenticatedRoute({ children }) {
    const isAuth = isUserLoggedIn();
    if (isAuth) {
      return children;
    }
    return <Navigate to="/" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginExample />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Dashboard />}>
          <Route
            path="/overview"
            element={
              <AuthenticatedRoute>
                {" "}
                <Overview />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/accounts"
            element={
              <AuthenticatedRoute>
                <ProtectedRoute allowedRole="SUPER_ADMIN">
                  <Accounts /> {/* //only super admin */}
                </ProtectedRoute>
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <AuthenticatedRoute>
                <Users />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <AuthenticatedRoute>
                <Groups />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <AuthenticatedRoute>
                <Activities />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/engagements"
            element={
              <AuthenticatedRoute>
                <Engagements />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/training"
            element={
              <AuthenticatedRoute>
                <Training />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/trainers"
            element={
              <AuthenticatedRoute>
                <Trainers />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/engagements/:engagementId/beneficiaries"
            element={
              <AuthenticatedRoute>
                <BeneficiariesPage />
              </AuthenticatedRoute>
            }
          />

          <Route
            path="/regions"
            element={
              <AuthenticatedRoute>
                <ProtectedAdminRoute>
                  <Regions /> {/*  only admins and super admin */}
                </ProtectedAdminRoute>
              </AuthenticatedRoute>
            }
          />

          <Route
            path="/counties" //only regional coordinators and admins
            element={
              <AuthenticatedRoute>
                <ProtectedRegionalCoordinatorRoute>
                  <Counties />
                </ProtectedRegionalCoordinatorRoute>
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/subcounties"
            element={
              <AuthenticatedRoute>
                <Subcounties />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/wards"
            element={
              <AuthenticatedRoute>
                <Wards />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/ward"
            element={
              <AuthenticatedRoute>
                <Ward />
              </AuthenticatedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <AuthenticatedRoute>
                <UserProfile />
              </AuthenticatedRoute>
            }
          />
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
