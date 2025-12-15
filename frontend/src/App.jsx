import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PlatformInsights from "./pages/PlatformInsights";
import EditProfile from "./pages/EditProfile";
import AdminDashboard from './pages/AdminDashboard';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Profile from "./pages/Profile";
import MyReviews from "./pages/MyReviews";
import CourseAnalysis from "./pages/CourseAnalysis";
import GenerateDescription from "./pages/GenerateDescription";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/my-reviews" element={<MyReviews />} />
        <Route path="/platform-insights" element={<PlatformInsights />} />
     
        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
           <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

        <Route
          path="/courses/:id/analysis"
          element={
            <ProtectedRoute>
              <CourseAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />



        <Route
          path="/generate-description"
          element={
            <ProtectedRoute>
              <GenerateDescription />
            </ProtectedRoute>
          }
        />
      </Routes>

    </div>
  );
}

export default App;
