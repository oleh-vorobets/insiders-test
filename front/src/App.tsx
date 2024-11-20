import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from 'react-router-dom';
import LoginPage from './pages/Auth/Login/LoginPage';
import SignupPage from './pages/Auth/Signup/SignupPage';
import ForgotPasswordPage from './pages/Auth/ForgotPassword/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPassword/ResetPasswordPage';
import WeatherPage from './pages/App/Weather/WeatherPage';
import { useAuth } from './providers/AuthProvider/AuthProvider';
import GalleryPage from './pages/App/Gallery/GalleryPage';

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    const { authenticated } = useAuth();
    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }
    return element;
};

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    { path: '/signup', element: <SignupPage /> },
    { path: '/forgot', element: <ForgotPasswordPage /> },
    { path: '/reset', element: <ResetPasswordPage /> },
    { path: '/', element: <ProtectedRoute element={<WeatherPage />} /> },
    { path: '/gallery', element: <ProtectedRoute element={<GalleryPage />} /> },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
