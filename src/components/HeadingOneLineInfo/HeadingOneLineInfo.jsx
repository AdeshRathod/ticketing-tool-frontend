import React from "react";

const HeadingOneLineInfo = ({ heading, info, className = "" }) => {
  return (
    <div style={{ margin: "1% 0%" }} className={className}>
      <h1 className="lg:text-2xl sm:text-lg text-base  !font-sans leading-none text-gray-700   font-semibold  ">
        {heading}
      </h1>
      <p className="text-gray-500  tracking-tight ">{info}</p>
    </div>
  );
};

export default HeadingOneLineInfo;
