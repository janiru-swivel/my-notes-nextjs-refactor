"use client";

import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import "./SideMenu.css";

function SideMenu({ onClose, onLogout }) {
  const router = useRouter();

  const handleLogoutClick = () => {
    onLogout();
    router.push("/mainpage");
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
