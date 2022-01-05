import {render} from "@testing-library/react";
import Button from "./Button";
import userEvent from "@testing-library/user-event";
import React from "react";

describe("Button Component Test", () => {
    it("Onclick Test", () => {
        const onClick = jest.fn();
        const buttonText = "1"
        const wrap = render(<Button buttonText={buttonText} onClick={() => onClick(buttonText)}/>)

        const button = wrap.getByRole("button");
        expect(button.textContent).toBe(buttonText);
        userEvent.click(button);
        expect(onClick).toBeCalledWith(buttonText);
        expect(onClick).toBeCalledTimes(1);

    })
});
