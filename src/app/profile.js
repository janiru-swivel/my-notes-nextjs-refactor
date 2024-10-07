import { useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({ username: "", email: "" });

  const handleUpdate = (e) => {
    e.preventDefault();
    // Handle profile update (Firebase or local storage)
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Profile</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>
        <button className="mt-4 p-2 bg-blue-500 text-white">
          Update Profile
        </button>
      </form>
    </div>
  );
}
