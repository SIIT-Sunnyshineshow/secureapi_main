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
import APIList from "./Pages/APIList";
import APIEdit from "./Pages/APIEdit";
import Attributes from "./Pages/Attributes";
import AppSetting from "./Pages/AppSetting";
import Test from "./Pages/Test";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/api_list" element={<APIList />} />
          <Route path="/APIEdit" element={<APIEdit />} />
          <Route path="/Attributes" element={<Attributes />} />
          <Route path="/AppSetting" element={<AppSetting />} />
          <Route path="/test" element={<Test />} />
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
