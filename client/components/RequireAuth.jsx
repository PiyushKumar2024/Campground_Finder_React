import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

//useLocation is a hook that captures the location the user tries to visit before they were 
// stopped and came to this component 
// http://localhost:3000/campgrounds/new, the location object will contain { pathname: '/campgrounds/new', ... }.
//useful for remembring the path
const RequireAuth = ({ children }) => {
    const { isLoggedIn } = useSelector((state) => state.user);
    const location = useLocation();
    // Check localStorage as a fallback to handle page refreshes
    const token = localStorage.getItem('token');

    if (!isLoggedIn && !token) {
        // Redirect to the login page, but save the current location they were trying to go to
        // This allows you to redirect them back there after they login
        return <Navigate to="/login" state={{ from: location, message: 'You must be signed in first!' }} replace />;

        //see the Navigate Tab
    }

    return children;
};

export default RequireAuth;
