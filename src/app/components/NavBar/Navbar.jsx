import { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import Link from "next/link";
import userIconImage from "../../assets/user-icon.png";
import "./NavBar.css";
import SideMenu from "../SideMenu/Sidemenu";

function NavBar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    alert("Logged out successfully");
    // Redirect to the homepage
    handleClose();
  };

  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Navbar.Brand as={Link} href="/home" className="app-name">
          My Notes
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Item>
              <Nav.Link as={Link} href="/home">
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} href="/about">
                About
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} href="/help">
                Help
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} href="/profile">
                Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} href="/trash" className="gap">
                Trash
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Navbar.Text className="signin-name">
            <span onClick={handleShow} style={{ cursor: "pointer" }}>
              <img
                src={userIconImage}
                alt="Sign In with Google"
                style={{ width: "30px", height: "auto", cursor: "pointer" }}
              />
            </span>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
      {show && <SideMenu onClose={handleClose} onLogout={handleLogout} />}
    </>
  );
}

export default NavBar;
