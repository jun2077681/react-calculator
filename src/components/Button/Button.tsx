import React from "react";

type ButtonProps = {
    buttonText: string;
    onClick: (buttonText: string) => void;
}

function Button({ buttonText, onClick }: ButtonProps) {

    return (
        <button key={buttonText} onClick={() => onClick(buttonText)}>{buttonText}</button>
    )
}

export default Button;
