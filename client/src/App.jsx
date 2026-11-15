import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import VerifyOtp from './pages/VerifyOtp.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Register from './pages/Register.jsx';
import RegistrationSuccess from './pages/RegistrationSuccess.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
          <Route path="/register/success" element={<ProtectedRoute><RegistrationSuccess /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
