import React from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../Firebase/firebase";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/user/userSlice";

function GoogleAuth() {
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      console.log("g login data", data);
      dispatch(loginSuccess(data));
    } catch (error) {
      console.log("Coundnt login with google", error);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={handleGoogleClick}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm shadow"
      >
        <FcGoogle size={20} />
        Login with Google
      </button>
    </div>
  );
}

export default GoogleAuth;
