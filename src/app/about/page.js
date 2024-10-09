import Navbar from "../components/NavBar/Navbar";

export default function About() {
  return (
    <div className="about-page">
      <Navbar />
      <br />
      <div className="about-content">
        <h1>About</h1>
        <p>
          Welcome to MyNotes, your go-to app for organizing and managing your
          notes. Our mission is to provide an intuitive and efficient platform
          to help you stay organized.
        </p>
        <p>
          Founded in 2024, MyNotes aims to offer a seamless experience for all
          your note-taking needs. Whether you`re a student, professional, or
          just looking to jot down your ideas, we`ve got you covered!
        </p>
      </div>
    </div>
  );
}
