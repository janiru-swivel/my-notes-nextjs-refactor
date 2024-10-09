import Navbar from "../components/NavBar/Navbar";

export default function About() {
  return (
    <div>
      <Navbar />
      <div className="about-page max-w-4xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
          About MyNotes
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center">
          Welcome to MyNotes, your go-to app for organizing and managing your
          notes. Our mission is to provide an intuitive and efficient platform
          to help you stay organized.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed text-center">
          Founded in 2024, MyNotes aims to offer a seamless experience for all
          your note-taking needs. Whether you’re a student, professional, or
          just looking to jot down your ideas, we’ve got you covered!
        </p>
      </div>
    </div>
  );
}
