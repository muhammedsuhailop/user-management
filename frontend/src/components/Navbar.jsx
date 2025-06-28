import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  return (
    <div className="bg-slate-200">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold">Home</h1>
        </Link>

        <ul className="flex gap-4">
          <Link to="/about">
            <li>About</li>
          </Link>

          {currentUser ? (
            <Link to="/profile" className="flex items-center">
              <img
                src={currentUser.profilePicture}
                alt="profile-img"
                className="w-8 h-8 rounded-full object-cover"
              />
            </Link>
          ) : (
            <Link to="/login">
              <li>Login</li>
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
