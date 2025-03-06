import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    
    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return children;
};