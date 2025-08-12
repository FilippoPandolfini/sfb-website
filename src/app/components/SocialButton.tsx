import React from "react";
import "../page.css";

const SocialButton: React.FC<{ name: string; link: string }> = ({ name, link }) => {
  return (
    <button
      className="social-button"
      onClick={() => (window.location.href = link)}
    >
      {name}
    </button>
  );
};

export default SocialButton;
