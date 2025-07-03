// Import stylesheet -----------
import "./styles.css";

// Import module -----------
// import { test } from "./test.js";

// Add image -----------
// import testImage from "./test.png";
// const image = document.createElement("img");
// image.src = testImage;

// Log to console -----------
console.log("hello world");

import GameController from "./GameController";

const controller = new GameController(true);
controller.selectShip(0);
controller.placeSelectedShip(0,0);
controller.selectShip(1);
controller.placeSelectedShip(1,1);
controller.selectShip(2);
controller.placeSelectedShip(2,2);
controller.selectShip(3);
controller.placeSelectedShip(3,3);
controller.selectShip(4);
controller.placeSelectedShip(4,4);