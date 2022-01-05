import { add, sub, mul, div } from "./calculateService"

describe("CalculateService Test", () => {
    const operand1 = 6;
    const operand2 = 3;

    test("Add Test", () => {
        const result = add(operand1, operand2);
        expect(result).toBe(9);
    });

    test("Sub Test", () => {
        const result = sub(operand1, operand2);
        expect(result).toBe(3);
    });

    test("Mul Test", () => {
        const result = mul(operand1, operand2);
        expect(result).toBe(18);
    });

    test("Div Test", () => {
        const result = div(operand1, operand2);
        expect(result).toBe(2);

        expect(() => div(operand1, 0)).toThrow(new Error("Zero Division"));
    });
})
