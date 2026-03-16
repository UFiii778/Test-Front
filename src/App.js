import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';
import LoadingScreen from './components/LoadingScreen';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import Dashboard from './pages/Dashboard/Dashboard';
import Hospitals from './pages/Hospitals/Hospitals';
import BloodStock from './pages/BloodStock/BloodStock';
import Requests from './pages/Requests/Requests';
import RequestDetail from './pages/RequestDetail/RequestDetail';
import CreateRequest from './pages/CreateRequest/CreateRequest';
import Appointments from './pages/Appointments/Appointments';
import CreateAppointment from './pages/CreateAppointment/CreateAppointment';
import News from './pages/News/News';
import NewsDetail from './pages/NewsDetail/NewsDetail';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/EditProfile/EditProfile';
import DonorDashboard from './pages/DonorDashboard/DonorDashboard';
import DonorHistory from './pages/DonorHistory/DonorHistory';
import DonorCertificate from './pages/DonorCertificate/DonorCertificate';
import PatientDashboard from './pages/PatientDashboard/PatientDashboard';
import PatientHistory from './pages/PatientHistory/PatientHistory';
import PMIDashboard from './pages/PMIDashboard/PMIDashboard';
import PMIStock from './pages/PMIStock/PMIStock';
import PMIVerify from './pages/PMIVerify/PMIVerify';
import VolunteerDashboard from './pages/VolunteerDashboard/VolunteerDashboard';
import VolunteerVerify from './pages/VolunteerVerify/VolunteerVerify';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminUsers from './pages/AdminUsers/AdminUsers';
import AdminReports from './pages/AdminReports/AdminReports';
import Chatbot from './pages/Chatbot/Chatbot';
import Notifications from './pages/Notifications/Notifications';
import Settings from './pages/Settings/Settings';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import FAQ from './pages/FAQ/FAQ';
import Terms from './pages/Terms/Terms';
import Privacy from './pages/Privacy/Privacy';
import NotFound from './pages/NotFound/NotFound';

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/blood-stock" element={<BloodStock />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/requests/:id" element={<RequestDetail />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />

              <Route element={<RoleRoute allowedRoles={['pasien']} />}>
                <Route path="/requests/create" element={<CreateRequest />} />
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
                <Route path="/patient/history" element={<PatientHistory />} />
                <Route path="/appointments/create" element={<CreateAppointment />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={['pendonor']} />}>
                <Route path="/donor/dashboard" element={<DonorDashboard />} />
                <Route path="/donor/history" element={<DonorHistory />} />
                <Route path="/donor/certificate/:id" element={<DonorCertificate />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={['pmi']} />}>
                <Route path="/pmi/dashboard" element={<PMIDashboard />} />
                <Route path="/pmi/stock" element={<PMIStock />} />
                <Route path="/pmi/verify" element={<PMIVerify />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={['sukarelawan']} />}>
                <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
                <Route path="/volunteer/verify" element={<VolunteerVerify />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/reports" element={<AdminReports />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
