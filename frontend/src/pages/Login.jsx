import React, { useState } from "react";
import { RiAdminFill } from "react-icons/ri";
import { useNavigate, Link } from "react-router-dom";
import {
  loginStart,
  loginFailure,
  loginSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

function Login() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.id]: "" }));
    dispatch(loginFailure(null));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      dispatch(loginFailure("Validation Error"));
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(loginFailure(data.message || `Server error: ${res.status}`));

        if (data.message?.includes("email")) {
          setFieldErrors({ email: "Email not found" });
        } else if (data.message?.includes("credentials")) {
          setFieldErrors({ password: "Wrong password" });
        }

        return;
      }

      dispatch(loginSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(loginFailure("Network error. Please try again."));
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <RiAdminFill />
          User- Management App
        </a>

        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login
            </h1>

            {error && (
              <div className="text-red-600 text-sm font-medium">{error}</div>
            )}

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`bg-gray-50 border ${
                    fieldErrors.email ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 ${
                    fieldErrors.email
                      ? "dark:border-red-500"
                      : "dark:border-gray-600"
                  } dark:placeholder-gray-400 dark:text-white`}
                  placeholder="Enter your Email"
                  onChange={handleChange}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className={`bg-gray-50 border ${
                    fieldErrors.password ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 ${
                    fieldErrors.password
                      ? "dark:border-red-500"
                      : "dark:border-gray-600"
                  } dark:placeholder-gray-400 dark:text-white`}
                  placeholder="Enter your password"
                  onChange={handleChange}
                />
                {fieldErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? "Please wait..." : "Login"}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
