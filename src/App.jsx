import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Overview from "./pages/overview/Overview";
import SAdmin from "./pages/sAdmin/SAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Dashboard />}>
          <Route path="/" element={<Overview />} />
          <Route path="/s-admin" element={<SAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
