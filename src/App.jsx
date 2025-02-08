import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OtpVerification from './pages/OtpVerification';
import Register from './pages/Register';
import { AuthProvider } from '/src/context/AuthContext';
import ProfilePage from '/src/pages/ProfilePage';
import UpdateProfile from '/src/components/UpdateProfile';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import UserDoubts from './pages/doubts/UserDoubts';
import Doubt from './pages/Doubt';
import AllDoubts from './pages/doubts/AllDoubts';
import AskDoubt from './pages/doubts/AskDoubt';
import DoubtDetail from './pages/doubts/DoubtDetail';
import MentorProfile from './pages/MentorProfile';
import AdminPage from './pages/AdminPage';
import SessionDetails from './pages/SessionDetails';
import Footer from './components/Footer';
import Schedule from './pages/Schedule';
import FileUpload from './pages/FileUpload';
import PYQs from './pages/PYQs';

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/otp" element={<OtpVerification />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/doubt" element={<Doubt />} />
          <Route path="/userDoubts" element={<UserDoubts />} />
          <Route path="/allDoubts" element={<AllDoubts />} />
          <Route path="/askDoubt" element={<AskDoubt />} />
          <Route path="/doubt/:id" element={<DoubtDetail />} />
          <Route path="/mentor/:id" element={<MentorProfile />} />
          <Route path="/session/:id" element={<SessionDetails />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/fileUpload" element={<FileUpload />} />
          <Route path="/pyqs" element={<PYQs />} />
        </Routes>
        <Footer/>
    </AuthProvider>
      </BrowserRouter>
  );
}

export default App;
