import React, { useState, useEffect } from "react";

function UserFormModal({ user, onClose }) {
  const isNewUser = !user;

  const [formData, setFormData] = useState({
    _id: user?._id || undefined,
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    isAdmin: user?.isAdmin || false,
    profilePicture:
      user?.profilePicture ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const backendApiBaseUrl = "/api";

  useEffect(() => {
    setFormData({
      _id: user?._id || undefined,
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      isAdmin: user?.isAdmin || false,
      profilePicture:
        user?.profilePicture ||
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    });
    setError(null);
    setSuccessMessage(null);
    setLoading(false);
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setError(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }

    if (isNewUser && !formData.password.trim()) {
      newErrors.password = "Password is required for new users.";
    } else if (
      !isNewUser &&
      formData.password.trim() &&
      formData.password.length < 6
    ) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setError("Enter valid data.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }
      if (isNewUser) {
        delete dataToSend._id;
      }

      const method = isNewUser ? "POST" : "PUT";
      const url = isNewUser
        ? `${backendApiBaseUrl}/admin/add-user`
        : `${backendApiBaseUrl}/admin/edit-user/${dataToSend._id}`;

      console.log("Submitting to URL:", url);
      console.log("Data being sent:", dataToSend);

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.message ||
            `Failed to ${isNewUser ? "create" : "update"} user`
        );
      }

      setSuccessMessage(
        `User ${isNewUser ? "created" : "updated"} successfully!`
      );
      setTimeout(() => {
        onClose(true);
      }, 1000);
    } catch (err) {
      console.error(
        `API Error ${isNewUser ? "creating" : "updating"} user:`,
        err
      );
      setError(
        err.message ||
          `An unknown error occurred while ${
            isNewUser ? "creating" : "updating"
          } user.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isNewUser ? "Create New User" : "Edit User"}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
          >
            &times;
          </button>
        </div>

        {loading && (
          <p className="text-blue-600 text-center mb-4">Processing...</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          {!isNewUser && (
            <div className="mb-4">
              <label
                htmlFor="_id"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                User ID:
              </label>
              <input
                type="text"
                id="_id"
                name="_id"
                value={formData._id || ""}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed"
                readOnly
                disabled
              />
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              placeholder="Enter username"
              disabled={loading}
            />
            {fieldErrors.username && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.username}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              placeholder="Enter email"
              disabled={loading}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              placeholder={
                isNewUser
                  ? "Enter password"
                  : "Leave blank to keep current password"
              }
              disabled={loading}
              {...(isNewUser ? { required: true } : {})}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label
              htmlFor="isAdmin"
              className="text-gray-700 text-sm font-bold"
            >
              As Admin?
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : isNewUser
                ? "Create User"
                : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserFormModal;
