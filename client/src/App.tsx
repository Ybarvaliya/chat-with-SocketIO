import { Navigate, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { AuthContext} from "./context/AuthContext";
import { useContext } from "react";

function App() {
  const { authUser } = useContext(AuthContext);
  return (
    <>
      <div className="p-4 h-screen flex items-center justify-center">
        <Router>
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <Signup />}
          />
        </Routes>
        <Toaster />
        </Router>
      </div>
    </>
  );
}

export default App;
