import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineLogout } from "react-icons/ai";
import { logout } from "../redux/user/userSlice";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Logout failed on server:", data.message);
      }

      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <div className="bg-slate-700 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-white text-2xl">
            User- Management <span className="text-blue-300">App</span>
          </h1>
        </Link>

        <ul className="flex gap-7 items-center">
          {currentUser && currentUser.isAdmin && (
            <Link to="/admin/dashboard">
              <li className="text-white hover:underline hover:text-blue-300 transition duration-200">
                Admin Dashboard
              </li>
            </Link>
          )}

          <Link to="/about">
            <li className="text-white hover:underline hover:text-blue-300 transition duration-200">
              About
            </li>
          </Link>

          {currentUser ? (
            <>
              <Link to="/profile" className="flex items-center gap-2">
                <img
                  src={
                    currentUser.profilePicture ||
                    "https://via.placeholder.com/32"
                  }
                  alt="profile-img"
                  title="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white hover:border-blue-300 transition duration-200"
                />
                <span className="hidden sm:inline text-white hover:text-blue-300 transition duration-200">
                  {currentUser.username.length > 8
                    ? `${currentUser.username.slice(0, 8)}...`
                    : currentUser.username}
                </span>
              </Link>

              <li>
                <button
                  onClick={handleLogout}
                  className="text-white text-xl p-1 rounded-full hover:bg-slate-500 transition duration-200 flex items-center justify-center"
                  title="Logout"
                >
                  <AiOutlineLogout />
                </button>
              </li>
            </>
          ) : (
            <Link to="/login">
              <li className="text-white hover:underline hover:text-blue-300 transition duration-200">
                Login
              </li>
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
