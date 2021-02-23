console.log("main.js");
// import { createApp } from "vue";
import { createApp } from "./src/runtime-canvas";
import gameComponent from "./src/components/GameContainer";
import { getRootCantainer } from "./src/Game";

createApp(gameComponent).mount(getRootCantainer());
