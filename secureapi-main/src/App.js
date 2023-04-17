import "./App.css";
import {
  BrowserRouter as BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/"
            element={
              <div>
                Hello, welcome{" "}
                <div>
                  <Home />
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
