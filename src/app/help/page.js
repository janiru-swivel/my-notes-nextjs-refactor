import Navbar from "../components/NavBar/Navbar";

export default function Help() {
  return (
    <div>
      <Navbar />
      <div className="help-content max-w-4xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
          Help & Support
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center">
          If you need help using MyNotes or have any questions, you’ve come to
          the right place!
        </p>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How to Use
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Learn how to get started with MyNotes, including adding, editing,
            and deleting notes. It's simple and intuitive – just follow the
            on-screen instructions, and you'll be a pro in no time!
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">FAQs</h2>
          <p className="text-gray-600 leading-relaxed">
            Find answers to the most frequently asked questions about MyNotes.
            Whether it's about account settings, recovering deleted notes, or
            syncing across devices – we’ve got you covered.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 leading-relaxed">
            If you still need assistance, feel free to reach out to our support
            team at{" "}
            <a
              href="mailto:janiruwickramage16@gmail.com"
              className="text-blue-600 underline"
            >
              janiruwickramage16@gmail.com
            </a>
            . We're here to help!
          </p>
        </div>
      </div>
    </div>
  );
}
