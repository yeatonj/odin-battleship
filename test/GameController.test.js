import GameController from "../src/GameController";

describe('Game Controller Tests', () => { 
    let controller;
    test('player has not placed any ships', () => {
        controller = new GameController(true);
        expect(controller.gamePhase).toBe(0);
    });

    test('player tries to place without ship selected 1', () => {
        controller = new GameController(true);
        expect(() => controller.placeSelectedShip(0, 0)).toThrow();
    });

    test('player has not placed all ships', () => {
        controller = new GameController(true);
        controller.selectShip(1);
        controller.placeSelectedShip(1, 1);

        expect(controller.gamePhase).toBe(0);
    });

    test('player tries to place without ship selected 2', () => {
        controller = new GameController(true);
        controller.selectShip(1);
        controller.placeSelectedShip(1, 1);
        expect(() => controller.placeSelectedShip(0, 0)).toThrow();
    });

    test('player has not placed all ships, misplaced one', () => {
        controller = new GameController(true);
        for (let i = 0; i < 4; i++) {
            controller.selectShip(i);
            controller.placeSelectedShip(i,0);
        }
        controller.selectShip(4);
        controller.placeSelectedShip(3,0);
        
        expect(controller.gamePhase).toBe(0);
    });

    test('player has not placed all ships, failed rotation on one', () => {
        controller = new GameController(true);
        controller.selectShip(0);
        controller.placeSelectedShip(1,0);
        controller.selectShip(1);
        controller.rotateSelectedShip();
        controller.placeSelectedShip(0,0);
        controller.selectShip(2);
        controller.placeSelectedShip(2,0);
        controller.selectShip(3);
        controller.placeSelectedShip(3,0);
        controller.selectShip(4);
        controller.placeSelectedShip(4,0);
        expect(controller.gamePhase).toBe(0);
    });

    test('player tries to place already placed ship', () => {
        controller = new GameController(true);
        controller.selectShip(1);
        controller.placeSelectedShip(1, 1);
        controller.selectShip(1);
        expect(() => {controller.placeSelectedShip(2, 2)}).toThrow();
    });

    test('player places all ships 1', () => {
        controller = new GameController(true);
        for (let i = 0; i < 5; i++) {
            controller.selectShip(i);
            controller.placeSelectedShip(i,0);
        }
        expect(controller.gamePhase).toBe(1);
    });

    test('player places all ships 2', () => {
        controller = new GameController(true);
        controller.selectShip(0);
        controller.placeSelectedShip(0,0);

        for (let i = 1; i < 5; i++) {
            controller.selectShip(i);
            controller.rotateSelectedShip();
            controller.placeSelectedShip(1,i);
        }
        expect(controller.gamePhase).toBe(1);
        
    });
    

});