import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  logout as logoutAction,
} from "../redux/user/userSlice";

function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      dispatch(logoutAction());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleChangePicture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxSizeInBytes = 2 * 1024 * 1024;

    setFileError("");

    if (!allowedTypes.includes(file.type)) {
      setFileError("Only JPEG, PNG, or WEBP images are allowed.");
      return;
    }

    if (file.size > maxSizeInBytes) {
      setFileError("File too large. Please upload an image smaller than 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "user-mngmnt");

    try {
      setUploading(true);

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhwkouiqd/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        dispatch(updateUserStart());

        const backendRes = await fetch(`/api/user/update/${currentUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profilePicture: data.secure_url }),
        });

        const updatedUser = await backendRes.json();

        if (!backendRes.ok) {
          throw new Error(updatedUser.message || "Failed to update user.");
        }

        dispatch(updateUserSuccess(updatedUser));
        dispatch(loginSuccess(updatedUser));
      } else {
        setFileError("Upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload or update failed:", err);
      setFileError("Something went wrong. Please try again.");
      dispatch(updateUserFailure(err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm text-center">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleChangePicture}
        />
        <img
          src={currentUser?.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
        {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
        <h2 className="text-xl font-semibold mb-2">{currentUser?.username}</h2>
        <p className="text-gray-600 mb-4">{currentUser?.email}</p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => fileRef.current.click()}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-60"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Change Profile Picture"}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
