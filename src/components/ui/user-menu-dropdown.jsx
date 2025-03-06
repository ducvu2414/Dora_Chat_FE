import { Dropdown, DropdownItem } from "@/components/ui/dropdown"
import { User, LogOut, Users } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import authApi from "@/api/auth";
import { AlertMessage } from '@/components/ui/alert-message';

export function UserMenuDropdown({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const user = localStorage.getItem('user');
      console.log(user);
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await authApi.logout({
        user, refreshToken
      });

      if (!response || response.error) {
        AlertMessage({
          type: "error",
          message: response?.data?.message || "Logout failed"
        });
        return;
      }

      // Clear Redux state
      dispatch(logout());

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Close dropdown
      onClose();

      AlertMessage({ type: "success", message: "Logged out successfully!" });
      // Navigate to login
      navigate('/login');
    } catch (error) {
      AlertMessage({
        type: "error",
        message: "Failed to logout. Please try again."
      });
    }
  };

  return (
    <Dropdown isOpen={isOpen} onClose={onClose} align="right" verticalAlign="top">
      <DropdownItem
        icon={User}
        onClick={() => {
          onClose()
          navigate("/user-information")
        }}
      >
        My Profile
      </DropdownItem>
      <DropdownItem
        icon={Users}
        onClick={() => {
          onClose()
          navigate("/contacts")
        }}
      >
        Contacts
      </DropdownItem>
      <DropdownItem
        icon={LogOut}
        onClick={handleLogout}
      >
        Log out
      </DropdownItem>
    </Dropdown>
  );
}

