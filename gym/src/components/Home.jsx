import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef(null);

  const handleNavigate = (path) => {
    setShowDropdown(false);
    navigate(path);
  };
  const handleButtonClick = () => {
    setShowDropdown(!showDropdown);
  };
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 2500); // 2.5 seconds
  };

  return (
    <div className="bg-black h-full max-w-full flex flex-col justify-center items-center pb-16 ">
      <div className="flex justify-center py-20">
        <div className="flex flex-col space-y-12 md:space-y-44 py-6">
          <h1 className="text-3xl md:text-8xl font-extrabold text-white whitespace-nowrap z-10 absolute start-12 md:start-20">
            THE ONLY WAY
          </h1>
          <div className="flex flex-col space-y-10 md:space-y-20 justify-start">
            <h1 className="text-xl font-extrabold text-white md:text-5xl absolute start-6 md:start-20">
              The Sale is here!
            </h1>
            <p className="text-sm md:text-xl text-white absolute start-6 md:start-20">
              Get 30% OFF on premium <br /> Supplements
            </p>
            <div className="w-32 md:w-64 absolute start-8 pt-10 md:pt-20 md:start-20">
              <img
                src="../Banner/supps.png"
                className="hover:rotate-3 hover:translate-x-6 duration-300"
                alt="supplements"
              />
            </div>
          </div>
        </div>

        <div className="md:max-w-5xl ml-44 w-1/2">
          <img
            src="../Banner/BannerHome.png"
            className="rounded-3xl md:max-w-4xl"
            alt="Home Banner"
          />
        </div>
      </div>

      {/* Dropdown Wrapper */}
      <div
        className="relative font-bold"
        onClick={handleButtonClick}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex space-x-4 md:w-24 md:h-12 md:text-lg mt-6 md:mt-0 md:justify-start justify-end w-full pl-32 md:pl-0">
          <button
            className={`
            text-black  bg-white w-32 md:w-48 md:h-12 md:text-lg p-2 text-xs whitespace-nowrap rounded-sm hover:scale-90 duration-300}`}
            onClick={() => navigate("/products")}
          >
            PRODUCTS
          </button>
          <button
            className={`text-black  bg-white w-32 md:w-48 md:h-12 md:text-lg p-2 text-xs whitespace-nowrap rounded-sm hover:scale-90 duration-300}`}
            onClick={() => navigate("/supplements")}
          >
            SUPPLEMENTS
          </button>
        </div>
      </div>
    </div>
  );
};
