"use client";

import Link from "next/link";
import withAuth from "../components/withAuth";

function MainPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] bg-white rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 text-gray-900">
      <h1 className="text-3xl mb-8">Welcome to My Notes</h1>
      <div className="flex space-x-5">
        <Link href="/login">
          <span className="px-5 py-3 text-lg bg-gray-800 text-white rounded-lg hover:bg-black cursor-pointer">
            Login
          </span>
        </Link>
        <Link href="/signup">
          <span className="px-5 py-3 text-lg bg-gray-800 text-white rounded-lg hover:bg-black cursor-pointer">
            Sign Up
          </span>
        </Link>
      </div>
    </div>
  );
}
export default withAuth(MainPage);
