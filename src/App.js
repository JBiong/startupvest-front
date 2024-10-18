import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';

import Profile from './Components/Profile';
import Companies from './Components/Companies';

import FundingRound from './Components/FundingRound';
import People from './Components/People';
import LandingPage from './Components/LandingPage';

import ViewStartupProfile from './Form/ViewStartupProfile';
import ViewFundingRound from './Form/ViewFundingRound';

import StartUpView from './VisitorView/startupProfileView';
import FundingRoundView from './VisitorView/fundingRoundView';
import UserView from './VisitorView/userProfileView';
import Faqs from './Components/Faqs';

import InvestorDashboard from './Dashboard/InvestorDashboard';
import StartupDashboard from './Dashboard/StartupDashboard';
import AdminDashboard from './Dashboard/AdminDashboard';
import ProtectedRoute from './Components/ProtectedRoute';

import { AuthProvider } from './Context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faqs" element={<Faqs />} />

          {/* Protected routes for all authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/fundinground" element={<FundingRound />} />
            <Route path="/people" element={<People />} />
            <Route path="/startupprofile" element={<ViewStartupProfile />} />
            <Route path="/fundingprofile" element={<ViewFundingRound />} />
            <Route path="/startupDashboard" element={<StartupDashboard />} />
            <Route path="/investorDashboard" element={<InvestorDashboard />} />
          </Route>

          {/* Admin-only route */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admindashboard" element={<AdminDashboard />} />
          </Route>

          {/* Visitor views - these remain unprotected */}
          <Route path="/startupview" element={<StartUpView />} />
          <Route path="/fundingroundview" element={<FundingRoundView />} />
          <Route path="/userview" element={<UserView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
