import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-[70%] h-[60%] md:h-[80vh] bg-white p-8 rounded-lg shadow-md">
          {currentUser ? (
            <>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome,{" "}
                <span className="text-blue-600">{currentUser.username}</span>!
              </h1>
              <p className="text-lg text-gray-600">
                You are now on the home page.
              </p>
              {currentUser.isAdmin && (
                <>
                  <br />
                  <Link
                    to="/admin/dashboard"
                    className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition duration-200"
                  >
                    Go to Admin Dashboard
                  </Link>
                </>
              )}
            </>
          ) : (
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome to the Home Page!
            </h1>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
