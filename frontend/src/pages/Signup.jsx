import React, { useState } from "react";
import { RiAdminFill } from "react-icons/ri";

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.id]: "" }));
    setGeneralError("");
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username?.trim()) errors.username = "Username is required";
    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.password) errors.password = "Password is required";
    if (!formData["confirm-password"]) {
      errors["confirm-password"] = "Please confirm your password";
    } else if (formData.password !== formData["confirm-password"]) {
      errors["confirm-password"] = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGeneralError("");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await res.text();

      if (!res.ok) {
        try {
          const errorData = JSON.parse(text);
          if (res.status === 409 && errorData.message) {
            if (errorData.message.includes("email")) {
              setFieldErrors({ email: "Email already registered" });
            } else if (errorData.message.includes("username")) {
              setFieldErrors({ username: "Username already taken" });
            } else {
              setGeneralError(errorData.message);
            }
          } else {
            setGeneralError(errorData.message || `Server error: ${res.status}`);
          }
        } catch (err) {
          setGeneralError(`Server error: ${res.status}`);
        }
        setLoading(false);
        return;
      }

      const data = JSON.parse(text);
      console.log("Signup success:", data);
    } catch (error) {
      setGeneralError("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
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
              Create an account
            </h1>

            {generalError && (
              <div className="text-red-600 text-sm font-medium">
                {generalError}
              </div>
            )}

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  User name
                </label>
                <input
                  type="text"
                  id="username"
                  className={`bg-gray-50 border ${
                    fieldErrors.username ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 ${
                    fieldErrors.username
                      ? "dark:border-red-500"
                      : "dark:border-gray-600"
                  } dark:placeholder-gray-400 dark:text-white`}
                  placeholder="Enter User Name"
                  onChange={handleChange}
                />
                {fieldErrors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.username}
                  </p>
                )}
              </div>

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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  className={`bg-gray-50 border ${
                    fieldErrors["confirm-password"]
                      ? "border-red-500"
                      : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 ${
                    fieldErrors["confirm-password"]
                      ? "dark:border-red-500"
                      : "dark:border-gray-600"
                  } dark:placeholder-gray-400 dark:text-white`}
                  placeholder="Confirm your password"
                  onChange={handleChange}
                />
                {fieldErrors["confirm-password"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors["confirm-password"]}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? "Please wait..." : "Create an account"}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
