import React from "react";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-[70%] h-[60%] md:h-[80vh] bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">About Us</h1>
          <p className="text-gray-600 leading-relaxed text-left">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Accusantium facilis provident eos fugit voluptate eveniet
            consequuntur ratione, eaque aut? Aut aliquam nesciunt aperiam omnis
            corrupti, ipsam at magni ea tenetur.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
