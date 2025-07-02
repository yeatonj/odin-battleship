import Ship from "./Ship.js";

describe('hello', () => {
    test('hello', () => {
        const ship = new Ship();
        expect(ship.hello()).toBe("hello");
    })
})