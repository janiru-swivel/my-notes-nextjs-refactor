"use client";

import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import "./SideMenu.css";

function SideMenu({ onClose, onLogout }) {
  const router = useRouter(); // Hook to access Next.js router

  const handleLogoutClick = () => {
    onLogout(); // Perform the logout action (Firebase logout or any auth provider)
    router.push("/MainPage"); // Redirect to MainPage after logout
  };

  return (
    <div className="side-menu">
      <button onClick={onClose} className="close-button">
        X
      </button>
      <button onClick={handleLogoutClick} className="logout-button">
        Logout
      </button>
    </div>
  );
}

SideMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default SideMenu;
