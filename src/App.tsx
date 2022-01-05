import React, {useCallback, useState} from 'react';
import './App.css';
import Button from "./components/Button/Button";
import {add, div, mul, sub} from "./services/calculateService";

type ValueType = {
    saveNumber: number | undefined;
    displayNumber: number | undefined;
    operation: "+" | "-" | "*" | "/";
    clearFlag?: boolean;
}

function App() {
    const [value, setValue] = useState<ValueType>({
        saveNumber: undefined,
        displayNumber: undefined,
        operation: "+",
    });

    const calc = useCallback ((value: ValueType) => {
        switch (value.operation) {
            case "+":
                return add(value.saveNumber ?? 0, value.displayNumber ?? 0);
            case "-":
                return sub(value.saveNumber ?? 0, value.displayNumber ?? 0);
            case "*":
                return mul(value.saveNumber ?? 0, value.displayNumber ?? 1);
            case "/":
                return div(value.saveNumber ?? 0, value.displayNumber ?? 1);
        }
    }, []);

    const onClick = useCallback((text: string) => {
        switch (text) {
            case "CLEAR":
                setValue({
                    saveNumber: 0,
                    displayNumber: undefined,
                    operation: "+",
                    clearFlag: true,
                });
                break;
            case "DEL":
                if (value.clearFlag !== true) {
                    setValue({
                        ...value,
                        displayNumber: Math.floor((value.displayNumber ?? 0)/ 10)
                    });
                }
                break;
            case "ENTER":
                const result = calc(value);
                setValue({
                    saveNumber: undefined,
                    displayNumber: result,
                    operation: "+",
                    clearFlag: true,
                });
                break;
            case "+":
            case "-":
            case "*":
            case "/":
                if (value.saveNumber === undefined) {
                    setValue({
                        saveNumber: value.displayNumber,
                        displayNumber: undefined,
                        operation: text,
                        clearFlag: true,
                    })
                } else {
                    const resultCalc = calc({
                        saveNumber: value.saveNumber,
                        displayNumber: value.displayNumber,
                        operation: text,
                    });
                    setValue({
                        saveNumber: resultCalc,
                        displayNumber: undefined,
                        operation: "+",
                        clearFlag: true,
                    });
                }
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                if (value.clearFlag) {
                    setValue({
                        saveNumber: value.saveNumber,
                        displayNumber: parseInt(text),
                        operation: value.operation,
                        clearFlag: false
                    })
                } else {
                    const nextValue = parseInt((value.displayNumber ?? "").toString().concat(text));
                    setValue({
                        ...value,
                        displayNumber: nextValue,
                        clearFlag: false,
                    });
                }
                break;
        }
    }, [value, calc]);


    return (
        <div>
            <div id={"screen"}>{value.displayNumber ?? value.saveNumber ?? 0}</div>
            {
                ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "CLEAR", "DEL", "ENTER", "+", "-", "*", "/"].map((buttonText) => {
                    return (
                        <Button key={buttonText} buttonText={buttonText} onClick={() => onClick(buttonText)}/>
                    )
                })
            }
        </div>
    )
        ;
}

export default App;
