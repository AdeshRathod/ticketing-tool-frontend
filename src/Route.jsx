import React from "react";
import { Route, Routes } from "react-router-dom";
import TermsAndConditionsPage from "./components/TermsPrivacyCookies/termsconditonpage";
import AnimationComponent from "./components/emailverify/verification-animation";
import ForgotPassword from "./components/forgotpassword/forgotpassword";
import ResetPassword from "./components/resetpassword/resetpassword";
import RequireAuth, { AuthProvider } from "./context/AuthProvider";
import Signup from "./pages/SignUp/NewSignUp";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PrivacyPolicy from "./components/TermsPrivacyCookies/PrivacyPolicy";
import TabTermsPrivacyPolicy from "./components/TermsPrivacyCookies/TabTermsPrivacyPolicy";
import ParentNotification from "./pages/AllNotifications/page";
import ResetNewPassword from "./pages/ResetNewPassword/ResetNewPassword";
import Header from "./components/app-layout/components/Header";
import LoginPage from "./pages/Test/LoginPage";
import SelfEmployeeTest from "./pages/Test/SelfEmployeeTest";
import RoleBasedNavigation from "./pages/HR-Helpdesk/Rolebasednav";
import HRAdminDashboard from "./pages/HR-Helpdesk/Dashboard/hradmindashboard";
import TicketHistory from "./pages/HR-Helpdesk/Employee/TicketHistory";
import HowToDocuments from "./pages/HR-Helpdesk/HowtoDoc/HowToDocuments";
import RaisedTickets from "./pages/HR-Helpdesk/admin/RaisedTickets";
import UserProfile from "./hooks/UserData/useUser";

const App = () => {
  return (
    <GoogleOAuthProvider clientId="849324104799-loeq6pqf7e7csvrir27tktq4abpcvmt9.apps.googleusercontent.com">
      <AuthProvider>
        <Routes>
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/terms-policy-cookies"
            element={<TabTermsPrivacyPolicy />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* SelfOnboarding */}
          <Route
            path="/organisation/:organisationId/Selfemployee-onboarding/:employeeId"
            element={
              <RequireAuth permission={["user"]}>
                <SelfEmployeeTest />
              </RequireAuth>
            }
          />
          <Route path="/" element={<Header />}>
            <Route
              path="/"
              element={
                <RequireAuth permission={["Admin", "user"]}>
                  <Header />
                </RequireAuth>
              }
            />

            <Route path="/resetpassword" element={<ResetNewPassword />} />

            <Route path="/verify/:token/" element={<AnimationComponent />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditionsPage />}
            />

            <Route
              path="/organisation/:organisationId/tickets"
              element={
                <RequireAuth permission={["Admin", "user"]}>
                  <RoleBasedNavigation />
                </RequireAuth>
              }
            />

            <Route
              path="/organisation/ticket-history"
              element={
                <RequireAuth permission={["user"]}>
                  <TicketHistory />
                </RequireAuth>
              }
            />
            <Route
              path="/employee-profile"
              element={
                <RequireAuth permission={["user", "admin"]}>
                  <UserProfile />
                </RequireAuth>
              }
            />

            <Route
              path="/organisation/raised-tickets"
              element={
                <RequireAuth permission={["Admin"]}>
                  <RaisedTickets />
                </RequireAuth>
              }
            />

            <Route
              path="/organisation/:organisationId/How-to-Doc"
              element={
                <RequireAuth permission={["user", "Admin"]}>
                  <HowToDocuments />
                </RequireAuth>
              }
            />

            <Route
              // path="/organisation/:organisationId/dashboard/HR-Admin"
              path="/Admin"
              element={
                <RequireAuth permission={["Admin"]}>
                  <HRAdminDashboard />
                </RequireAuth>
              }
            />

            <Route
              path="/notification"
              element={
                <RequireAuth permission={["Admin", "user"]}>
                  <ParentNotification />
                </RequireAuth>
              }
            />
            <Route
              path="/organisation/:organisationId/notification"
              element={
                <RequireAuth permission={["Admin", "user"]}>
                  <ParentNotification />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
