import { type ReactElement, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './commons/contexts/AuthContext';
import LoadingSpinner from './commons/components/LoadingSpinner';
import { ThemeProvider } from './commons/contexts/ThemeContext';
import Layout from './commons/components/Layout';

interface PrivateRouteProps {
  children: ReactElement
}

const PrivateRoute = ({
  children
}: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

interface PublicRouteProps {
  children: ReactElement
}

const PublicRoute = ({
  children
}: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return !isAuthenticated ? children : <Navigate to="/" />;
};

const LoginPage = lazy(() => import('./auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('./user/pages/DashboardPage'));
const OAuth2CallbackPage = lazy(() => import('./auth/pages/OAuth2CallbackPage'));
const ActiveSessionsPage = lazy(() => import('./auth/pages/ActiveSessionsPage'));
const MfaSettingsPage = lazy(() => import('./auth/pages/MfaSettingsPage'));
const VerifyEmailPage = lazy(() => import('./user/pages/VerifyEmailPage'));
const ResendVerificationPage = lazy(() => import('./user/pages/ResendVerificationPage'));
const ForgotPasswordPage = lazy(() => import('./user/pages/ForgotPasswordPage'));
const RegisterPage = lazy(() => import('./user/pages/RegisterPage'));
const ChangeEmailPage = lazy(() => import('./user/pages/ChangeEmailPage'));
const ChangePasswordPage = lazy(() => import('./user/pages/ChangePasswordPage'));
const DeleteAccountPage = lazy(() => import('./user/pages/DeleteAccountPage'));
const UpdateProfilePage = lazy(() => import('./user/pages/UpdateProfilePage'));
const AdminPanelPage = lazy(() => import('./admin/pages/AdminPanelPage'));
const CreateUsersPage = lazy(() => import('./admin/pages/CreateUsersPage'));
const CreateRolesPage = lazy(() => import('./admin/pages/CreateRolesPage'));
const DeleteUsersPage = lazy(() => import('./admin/pages/DeleteUsersPage'));
const DeleteRolesPage = lazy(() => import('./admin/pages/DeleteRolesPage'));
const ReadUsersPage = lazy(() => import('./admin/pages/ReadUsersPage'));
const ReadRolesPage = lazy(() => import('./admin/pages/ReadRolesPage'));
const ReadPermissionsPage = lazy(() => import('./admin/pages/ReadPermissionsPage'));
const UpdateUsersPage = lazy(() => import('./admin/pages/UpdateUsersPage'));
const UpdateRolesPage = lazy(() => import('./admin/pages/UpdateRolesPage'));

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route path="/verify-email" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
                <Route path="/resend-verification" element={<PublicRoute><ResendVerificationPage /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
                <Route
                  path="/oauth2/callback"
                  element={
                    <PublicRoute>
                      <OAuth2CallbackPage />
                    </PublicRoute>
                  }
                />
                <Route path="/" element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                } />
                <Route path="/mfa-settings" element={
                  <PrivateRoute>
                    <MfaSettingsPage />
                  </PrivateRoute>
                } />
                <Route path="/change-password" element={
                  <PrivateRoute>
                    <ChangePasswordPage />
                  </PrivateRoute>
                } />
                <Route path="/change-email" element={
                  <PrivateRoute>
                    <ChangeEmailPage />
                  </PrivateRoute>
                } />
                <Route path="/delete-account" element={
                  <PrivateRoute>
                    <DeleteAccountPage />
                  </PrivateRoute>
                } />
                <Route path="/update-profile" element={
                  <PrivateRoute>
                    <UpdateProfilePage />
                  </PrivateRoute>
                } />
                <Route path="/active-sessions" element={
                  <PrivateRoute>
                    <ActiveSessionsPage />
                  </PrivateRoute>
                } />
                <Route path="/admin" element={
                  <PrivateRoute>
                    <AdminPanelPage />
                  </PrivateRoute>
                } />
                <Route path="/admin/create-users" element={
                  <PrivateRoute>
                    <CreateUsersPage />
                  </PrivateRoute>
                } />
                <Route path="/admin/create-roles" element={
                  <PrivateRoute>
                    <CreateRolesPage />
                  </PrivateRoute>
                } />
                <Route path="/admin/delete-users" element={
                  <PrivateRoute>
                    <DeleteUsersPage />
                  </PrivateRoute>
                } />
                <Route path="/admin/delete-roles" element={
                  <PrivateRoute>
                    <DeleteRolesPage />
                  </PrivateRoute>
                } />
                <Route path="/admin/read-users" element={
                  <PrivateRoute>
                    <ReadUsersPage />
                  </PrivateRoute>
                } />
                <Route path="/admin/read-roles" element={
                  <PrivateRoute>
                    <ReadRolesPage />
                  </PrivateRoute>
                } />
                <Route path="/admin/read-permissions" element={
                  <PrivateRoute>
                    <ReadPermissionsPage />
                  </PrivateRoute>
                } />
                <Route path="/admin/update-users" element={
                  <PrivateRoute>
                    <UpdateUsersPage />
                  </PrivateRoute>
                } />
                <Route path="/admin/update-roles" element={
                  <PrivateRoute>
                    <UpdateRolesPage />
                  </PrivateRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
