import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Overview from "./pages/overview/Overview";
import SAdmin from "./pages/sAdmin/SAdmin";
import Login from "./pages/login/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Dashboard />}>
          <Route path="/overview" element={<Overview />} />
          <Route path="/s-admin" element={<SAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
