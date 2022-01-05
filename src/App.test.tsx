import React from 'react';
import App from './App';
import {render} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function randomIntGenerator() {
    return Math.floor(Math.random() * 10);
}

/*
    TODO 계산기 프로그램 만들기 요구사항

    1. 계산기 프로그램을 만들어주세요.
    2. 사칙 연산이 가능해야함.
    3. 숫자는 0~9까지 존재해야함
    4. 스페셜버튼 -> CLEAR, DEL, ENTER 버튼이 있어야함
    5. 스페셜버튼중 CLEAR => 현재 계산된 값, 현재 KEY IN한 값을 모두 초기화
    6. 스페셜버튼중 DEL => 현재 KEY IN한 값중 맨 마지막 숫자만 삭제
    7. 스페셜버튼중 ENTER => 현재 KEY IN한 값의 사칙연산 적용
    8. '1+1+' ==> 결과값 도출해야함. '2'가 나와야함
    9. 초기 보여지는 결과값은 '0'
    10. 현재 보여지는 텍스트가 '0'이었을 때 숫자를 누르게 되면 '01'이 아닌 '1'로 보여지도록 함.
    11. 스페셜버튼중 DEL => 만약, 삭제한 값이 맨 마지막 숫자였다면 보여지는 KEY IN은 '0'으로 하도록 함.
 */

const expectButtons = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "CLEAR", "DEL", "ENTER", "+", "-", "*", "/"];
const numberButtons = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const specialButtons = ["CLEAR", "DEL", "ENTER"];
const calcButtons = ["+", "-", "*", "/"];

describe("App Test", () => {
    describe("Render Test", () => {

        // Request 2, 3, 4 Test
        it("Button Render Test", () => {
            const wrap = render(<App/>)

            const buttons = wrap.getAllByRole("button");
            expect(buttons).toHaveLength(expectButtons.length);

            expectButtons.forEach((text) => {
                const button = wrap.getByRole("button", {name: text});
                expect(button.textContent).toBe(text);
            });
        });

        // Request 9 Test
        it("Screen Render Test", () => {
            const wrap = render(<App/>)
            const screen = wrap.container.querySelector("#screen");
            expect(screen).not.toBeNull()

            if (screen) {
                expect(screen.textContent).toBe("0");
            }
        });
    })

    describe("Action Test", () => {
        // Request 10 Test
        describe("First Button Test", () => {
            numberButtons.forEach((buttonText) => {
                it(`Input Number Button Test ${buttonText}`, () => {
                    const wrap = render(<App/>)
                    const screen = wrap.container.querySelector("#screen");
                    const button = wrap.getByText(buttonText, {selector: "button"})
                    expect(screen).not.toBeNull();

                    if (screen) {
                        expect(screen.textContent).toBe("0");
                        userEvent.click(button);
                        expect(screen.textContent).toBe(buttonText);
                    }
                })
            });

            specialButtons.forEach((buttonText) => {
                it(`Input Special Button Test ${buttonText}`, () => {
                    const wrap = render(<App/>);
                    const screen = wrap.container.querySelector("#screen");
                    const button = wrap.getByText(buttonText, {selector: "button"});
                    expect(screen).not.toBeNull();

                    if (screen) {
                        expect(screen.textContent).toBe("0");
                        userEvent.click(button);
                        expect(screen.textContent).toBe("0");
                    }
                })
            });

            calcButtons.forEach((actionText) => {
                it(`Calculate Button Test ${actionText}`, () => {
                    const wrap = render(<App/>)
                    const screen = wrap.container.querySelector("#screen");
                    const button = wrap.getByText(actionText, {selector: "button"})
                    expect(screen).not.toBeNull();

                    if (screen) {
                        const currentText = screen.textContent;
                        userEvent.click(button);
                        expect(screen.textContent).toBe(currentText);
                    }
                })
            });
        })

        describe("Number Buttons Test", () => {
            numberButtons.forEach((buttonText) => {
                it(`Number Button Test ${buttonText}`, () => {
                    const wrap = render(<App/>)
                    const screen = wrap.container.querySelector("#screen");

                    if (screen) {
                        for (let i = randomIntGenerator(); i > 0; i--) {
                            const random = randomIntGenerator();
                            const randomButton = wrap.getByText(random, {selector: "button"});
                            userEvent.click(randomButton);
                        }

                        const currentText = screen.textContent;
                        const button = wrap.getByText(buttonText, {selector: "button"});
                        userEvent.click(button);
                        if (currentText === "0") {
                            expect(screen.textContent).toBe(buttonText);
                        } else {
                            expect(screen.textContent).toBe(currentText + buttonText);
                        }
                    }
                })
            })
        });

        describe("Special Buttons Test", () => {
            // Request 5 Test
            it("Clear Button Test", () => {
                const wrap = render(<App/>)
                const screen = wrap.container.querySelector("#screen");

                if (screen) {
                    for (let i = randomIntGenerator(); i > 0; i--) {
                        const random = randomIntGenerator();
                        const randomButton = wrap.getByText(random, {selector: "button"});
                        userEvent.click(randomButton);
                    }

                    const button = wrap.getByText("CLEAR", {selector: "button"});
                    userEvent.click(button);
                    expect(screen.textContent).toBe("0");
                }
            });

            // Request 6, 11 Test
            it("Delete Button Test", () => {
                const wrap = render(<App/>)
                const screen = wrap.container.querySelector("#screen");

                if (screen) {
                    for (let i = randomIntGenerator(); i > 0; i--) {
                        const random = randomIntGenerator();
                        const randomButton = wrap.getByText(random, {selector: "button"});
                        userEvent.click(randomButton);
                    }

                    const currentText = screen.textContent;
                    const button = wrap.getByText("DEL", {selector: "button"});
                    userEvent.click(button);

                    if (currentText?.length === 1) {
                        // Request 11 Test
                        expect(screen.textContent).toBe("0");
                    } else {
                        // Request 6 Test
                        expect(screen.textContent).toBe(currentText?.slice(0, -1));
                    }
                }
            });
        });
    })
});

describe("Service Test", () => {
    describe("Calculate Service Test", () => {
        // Request 2 Test
        describe("Once Calculate Text", () => {
            it("Add Test", () => {
                const wrap = render(<App/>)
                const screen = wrap.container.querySelector("#screen");

                if (screen) {
                    const addButton = wrap.getByText("+", {selector: "button"});
                    const enterButton = wrap.getByText("ENTER", {selector: "button"});

                    for (let i = randomIntGenerator(); i > 0; i--) {
                        const random = Math.floor(Math.random() * 10);
                        const randomButton = wrap.getByText(random, {selector: "button"});
                        userEvent.click(randomButton);
                    }
                    const operand1 = screen.textContent;
                    userEvent.click(addButton);

                    for (let i = randomIntGenerator(); i > 0; i--) {
                        const random = Math.floor(Math.random() * 10);
                        const randomButton = wrap.getByText(random, {selector: "button"});
                        userEvent.click(randomButton);
                    }
                    const operand2 = screen.textContent;
                    userEvent.click(enterButton);

                    expect(screen.textContent).toBe((parseInt(operand1 ?? "0") + parseInt(operand2 ?? "0")).toString());
                }
            });

            it("Sub Test", () => {
                const wrap = render(<App/>)
                const screen = wrap.container.querySelector("#screen");

                if (screen) {
                    const subButton = wrap.getByText("-", {selector: "button"});
                    const enterButton = wrap.getByText("ENTER", {selector: "button"});

                    for (let i = randomIntGenerator(); i > 0; i--) {
                        const random = Math.floor(Math.random() * 10);
                        const randomButton = wrap.getByText(random, {selector: "button"});
                        userEvent.click(randomButton);
                    }
                    const operand1 = screen.textContent;
                    userEvent.click(subButton);

                    for (let i = randomIntGenerator(); i > 0; i--) {
                        const random = Math.floor(Math.random() * 10);
                        const randomButton = wrap.getByText(random, {selector: "button"});
                        userEvent.click(randomButton);
                    }
                    const operand2 = screen.textContent;
                    userEvent.click(enterButton);

                    expect(screen.textContent).toBe((parseInt(operand1 ?? "0") - parseInt(operand2 ?? "0")).toString());
                }
            });

            it("Mul Test", () => {
                const wrap = render(<App/>)
                const screen = wrap.container.querySelector("#screen");

                if (screen) {
                    const mulButton = wrap.getByText("*", {selector: "button"});
                    const enterButton = wrap.getByText("ENTER", {selector: "button"});

                    for (let i = randomIntGenerator(); i > 0; i--) {
                        const random = Math.floor(Math.random() * 10);
                        const randomButton = wrap.getByText(random, {selector: "button"});
                        userEvent.click(randomButton);
                    }
                    const operand1 = screen.textContent;
                    userEvent.click(mulButton);

                    for (let i = randomIntGenerator(); i > 0; i--) {
                        const random = Math.floor(Math.random() * 10);
                        const randomButton = wrap.getByText(random, {selector: "button"});
                        userEvent.click(randomButton);
                    }
                    const operand2 = screen.textContent;
                    userEvent.click(enterButton);

                    expect(screen.textContent).toBe((parseInt(operand1 ?? "0") * parseInt(operand2 ?? "0")).toString());
                }
            });

            it("Div Test", () => {
                const wrap = render(<App/>)
                const screen = wrap.container.querySelector("#screen");

                if (screen) {
                    const divButton = wrap.getByText("/", {selector: "button"});
                    const enterButton = wrap.getByText("ENTER", {selector: "button"});

                    for (let i = randomIntGenerator(); i > 0; i--) {
                        const random = Math.floor(Math.random() * 10);
                        const randomButton = wrap.getByText(random, {selector: "button"});
                        userEvent.click(randomButton);
                    }
                    const operand1 = screen.textContent;
                    userEvent.click(divButton);

                    for (let i = randomIntGenerator(); i > 0; i--) {
                        const random = Math.floor(Math.random() * 10);
                        const randomButton = wrap.getByText(random, {selector: "button"});
                        userEvent.click(randomButton);
                    }
                    const operand2 = screen.textContent;
                    userEvent.click(enterButton);

                    if (operand2 === "0") {
                        expect(screen.textContent).toBe("Zero Division Error.");
                    }

                    expect(screen.textContent).toBe(Math.floor(parseInt(operand1 ?? "0") / parseInt(operand2 ?? "0")).toString());
                }
            });
        })

        describe("Multiple Calculate Test", () => {
            it("Calculate After Enter Test", () => {
                const wrap = render(<App/>)
                const screen = wrap.container.querySelector("#screen");

                if (screen) {
                    const calcButton = wrap.getByText(calcButtons[Math.floor(Math.random() * 4)], {selector: "button"});
                    const enterButton = wrap.getByText("ENTER", {selector: "button"});

                    for (let i = randomIntGenerator(); i > 0; i--) {
                        const random = Math.floor(Math.random() * 10);
                        const randomButton = wrap.getByText(random, {selector: "button"});
                        userEvent.click(randomButton);
                    }
                    userEvent.click(calcButton);

                    for (let i = randomIntGenerator(); i > 0; i--) {
                        const random = Math.floor(Math.random() * 10);
                        const randomButton = wrap.getByText(random, {selector: "button"});
                        userEvent.click(randomButton);
                    }
                    userEvent.click(enterButton);

                    const random = Math.floor(Math.random() * 10);
                    const randomButton = wrap.getByText(random, {selector: "button"});
                    userEvent.click(randomButton);

                    expect(screen.textContent).toBe(random.toString());
                }
            });

            // Request 6 Test
            describe("Delete After Special Button Test", () => {
                it("Delete After Enter Button Test", () => {

                    const wrap = render(<App/>)
                    const screen = wrap.container.querySelector("#screen");

                    if (screen) {
                        const addButton = wrap.getByText("+", {selector: "button"});
                        const oneButton = wrap.getByText("1", {selector: "button"});
                        const enterButton = wrap.getByText("ENTER", {selector: "button"});
                        const delButton = wrap.getByText("DEL", {selector: "button"});

                        userEvent.click(oneButton);
                        userEvent.click(addButton);
                        userEvent.click(oneButton);
                        userEvent.click(enterButton);
                        expect(screen.textContent).toBe("2");
                        userEvent.click(delButton);
                        expect(screen.textContent).toBe("2");
                    }
                });

                it("Delete After Operation Button Test", () => {
                    const wrap = render(<App />);
                    const screen = wrap.container.querySelector("#screen");

                    if (screen) {
                        const addButton = wrap.getByText("+", {selector: "button"});
                        const oneButton = wrap.getByText("1", {selector: "button"});
                        const delButton = wrap.getByText("DEL", {selector: "button"});

                        userEvent.click(oneButton);
                        userEvent.click(addButton);
                        expect(screen.textContent).toBe("1");
                        userEvent.click(delButton);
                        expect(screen.textContent).toBe("1");
                        userEvent.click(oneButton);
                        expect(screen.textContent).toBe("1");
                        userEvent.click(addButton);
                        expect(screen.textContent).toBe("2");
                        userEvent.click(delButton);
                        expect(screen.textContent).toBe("2");

                    }
                });
            })

            // Request 8 Test
            it("Multiple Operator Test", () => {
                const wrap = render(<App/>)
                const screen = wrap.container.querySelector("#screen");

                if (screen) {
                    const addButton = wrap.getByText("+", {selector: "button"});
                    const oneButton = wrap.getByText("1", {selector: "button"});
                    const enterButton = wrap.getByText("ENTER", {selector: "button"});

                    userEvent.click(oneButton);
                    userEvent.click(addButton);
                    userEvent.click(oneButton);
                    userEvent.click(addButton);
                    expect(screen.textContent).toBe("2");
                    userEvent.click(oneButton);
                    expect(screen.textContent).toBe("1");
                    userEvent.click(enterButton);
                    expect(screen.textContent).toBe("3");
                }
            })
        })


    })
});
