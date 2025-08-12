import React from "react";
import './SocialButton.css';

interface SocialButtonProps {
    name: string;
    link: string;
}
const SocialButton: React.FC<SocialButtonProps> = ({ name, link }) => (

    <a className= "social-button" href = { link } target = "_blank" rel = "noppener noreferrer" >
        { name }
        </a>
    );

export default SocialButton;