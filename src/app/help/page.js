import Navbar from "../components/NavBar/Navbar";

export default function Help() {
  return (
    <div>
      <Navbar />
      <br />
      <div className="help-content">
        <h1>Help & Support</h1>
        <p>
          If you need help using MyNotes or have any questions, you’ve come to
          the right place!
        </p>
        <h2>How to Use</h2>
        <p>
          Learn how to get started with MyNotes, including adding, editing, and
          deleting notes.
        </p>
        <h2>FAQs</h2>
        <p>
          Find answers to the most frequently asked questions about MyNotes.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you still need assistance, please contact our support team at
          janiruwickramage16@gmail.com
        </p>
      </div>
    </div>
  );
}
