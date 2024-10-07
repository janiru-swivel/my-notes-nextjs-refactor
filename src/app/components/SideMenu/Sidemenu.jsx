import PropTypes from "prop-types";
import "./SideMenu.css";

function SideMenu({ onClose, onLogout }) {
  return (
    <div className="side-menu">
      <button onClick={onClose} className="close-button">
        X
      </button>
      <button onClick={onLogout} className="logout-button">
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
