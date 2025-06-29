import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm">
          &copy; {currentYear} User Management Sysytem. All rights reserved.
        </p>
        <p className="text-xs mt-1 text-gray-400">Conatct us...</p>
      </div>
    </footer>
  );
};

export default Footer;
